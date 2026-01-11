import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { GLView } from 'expo-gl';
import { Asset } from 'expo-asset';
import { BeautyParams } from '../types/beauty';
import { vertexShader, fragmentShader } from '../shaders/beautyShader';

interface BeautyRendererProps {
  imageUri: string;
  beautyParams: BeautyParams;
  style?: any;
  onRenderComplete?: () => void;
}

export default function BeautyRenderer({
  imageUri,
  beautyParams,
  style,
  onRenderComplete,
}: BeautyRendererProps) {
  const glRef = useRef<any>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const textureRef = useRef<WebGLTexture | null>(null);

  useEffect(() => {
    if (glRef.current) {
      updateUniforms();
    }
  }, [beautyParams]);

  const onContextCreate = async (gl: any) => {
    glRef.current = gl;

    // 编译 Shader
    const program = createShaderProgram(gl);
    if (!program) {
      console.error('Failed to create shader program');
      return;
    }
    programRef.current = program;

    // 加载纹理
    const texture = await loadTexture(gl, imageUri);
    if (!texture) {
      console.error('Failed to load texture');
      return;
    }
    textureRef.current = texture;

    // 设置顶点缓冲区
    setupVertexBuffer(gl, program);

    // 初始渲染
    render(gl, program, texture);
    
    if (onRenderComplete) {
      onRenderComplete();
    }
  };

  const createShaderProgram = (gl: any): WebGLProgram | null => {
    // 编译顶点着色器
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vertexShader);
    gl.compileShader(vs);
    
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error('Vertex shader error:', gl.getShaderInfoLog(vs));
      return null;
    }

    // 编译片段着色器
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fragmentShader);
    gl.compileShader(fs);
    
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error('Fragment shader error:', gl.getShaderInfoLog(fs));
      return null;
    }

    // 链接程序
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return null;
    }

    gl.useProgram(program);
    return program;
  };

  const loadTexture = async (gl: any, uri: string): Promise<WebGLTexture | null> => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 加载图片
    const asset = Asset.fromURI(uri);
    await asset.downloadAsync();

    const image = new Image();
    image.src = asset.localUri || uri;
    
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    // 上传纹理
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    
    // 设置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    return texture;
  };

  const setupVertexBuffer = (gl: any, program: WebGLProgram) => {
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  };

  const updateUniforms = () => {
    const gl = glRef.current;
    const program = programRef.current;
    const texture = textureRef.current;

    if (!gl || !program || !texture) return;

    render(gl, program, texture);
  };

  const render = (gl: any, program: WebGLProgram, texture: WebGLTexture) => {
    gl.useProgram(program);

    // 设置纹理
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(gl.getUniformLocation(program, 'texture'), 0);

    // 设置美颜参数（归一化到 0-1）
    gl.uniform1f(gl.getUniformLocation(program, 'smoothing'), beautyParams.smoothing / 100);
    gl.uniform1f(gl.getUniformLocation(program, 'whitening'), beautyParams.whitening / 100);
    gl.uniform1f(gl.getUniformLocation(program, 'faceSlim'), beautyParams.faceSlim / 100);
    gl.uniform1f(gl.getUniformLocation(program, 'eyeEnlarge'), beautyParams.eyeEnlarge / 100);
    gl.uniform1f(gl.getUniformLocation(program, 'brightness'), beautyParams.brightness / 100);
    gl.uniform1f(gl.getUniformLocation(program, 'contrast'), beautyParams.contrast / 100);
    gl.uniform1f(gl.getUniformLocation(program, 'saturation'), beautyParams.saturation / 100);

    // 渲染
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // 刷新缓冲区
    gl.flush();
    gl.endFrameEXP();
  };

  return (
    <GLView
      style={[styles.glView, style]}
      onContextCreate={onContextCreate}
    />
  );
}

const styles = StyleSheet.create({
  glView: {
    flex: 1,
  },
});
