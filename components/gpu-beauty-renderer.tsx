import React, { useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { GLView, ExpoWebGLRenderingContext } from "expo-gl";
import { BeautyParams, vertexShader, fragmentShader } from "@/lib/gpu-beauty-filter";

interface GPUBeautyRendererProps {
  imageUri: string;
  params: BeautyParams;
  onRenderComplete?: () => void;
  style?: any;
}

/**
 * GPU实时美颜渲染组件
 * 使用WebGL Shader实现<100ms响应的实时美颜效果
 */
export function GPUBeautyRenderer({
  imageUri,
  params,
  onRenderComplete,
  style,
}: GPUBeautyRendererProps) {
  const glRef = useRef<ExpoWebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const textureRef = useRef<WebGLTexture | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // 初始化WebGL
  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    glRef.current = gl;

    // 编译顶点着色器
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, vertexShader);
    gl.compileShader(vs);

    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error("Vertex shader error:", gl.getShaderInfoLog(vs));
      return;
    }

    // 编译片段着色器
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, fragmentShader);
    gl.compileShader(fs);

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error("Fragment shader error:", gl.getShaderInfoLog(fs));
      return;
    }

    // 创建程序
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    programRef.current = program;
    gl.useProgram(program);

    // 创建顶点缓冲
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // 加载纹理
    await loadTexture(gl, imageUri);

    // 开始渲染循环
    startRenderLoop();

    if (onRenderComplete) {
      onRenderComplete();
    }
  };

  // 加载纹理
  const loadTexture = async (gl: ExpoWebGLRenderingContext, uri: string) => {
    const texture = gl.createTexture();
    if (!texture) {
      console.error("Failed to create texture");
      return;
    }

    textureRef.current = texture;

    // 创建临时1x1纹理
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([255, 0, 255, 255])
    );

    // 加载实际图像
    try {
      const asset = await fetch(uri);
      const blob = await asset.blob();
      const imageBitmap = await createImageBitmap(blob);

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageBitmap as any);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    } catch (error) {
      console.error("Failed to load texture:", error);
    }
  };

  // 渲染循环
  const startRenderLoop = () => {
    const render = () => {
      const gl = glRef.current;
      const program = programRef.current;
      const texture = textureRef.current;

      if (!gl || !program || !texture) {
        return;
      }

      // 清空画布
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // 设置uniform变量（美颜参数）
      gl.uniform1f(gl.getUniformLocation(program, "skin"), params.skin);
      gl.uniform1f(gl.getUniformLocation(program, "whitening"), params.whitening);
      gl.uniform1f(gl.getUniformLocation(program, "light"), params.light);
      gl.uniform1f(gl.getUniformLocation(program, "color"), params.color);

      // 绑定纹理
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

      // 绘制
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // 刷新到屏幕
      gl.endFrameEXP();

      // 继续下一帧
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
  };

  // 参数变化时更新渲染
  useEffect(() => {
    // 参数变化会在下一帧自动应用，无需手动触发
  }, [params]);

  // 清理
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <View style={[styles.container, style]}>
      <GLView
        style={styles.glView}
        onContextCreate={onContextCreate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  glView: {
    flex: 1,
  },
});
