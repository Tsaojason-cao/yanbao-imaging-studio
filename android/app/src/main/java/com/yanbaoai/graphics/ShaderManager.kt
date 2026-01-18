package com.yanbaoai.graphics

import android.content.Context
import android.opengl.GLES20
import java.io.BufferedReader
import java.io.InputStreamReader

class ShaderManager(private val context: Context) {

    fun loadShaderProgram(vertexShaderName: String, fragmentShaderName: String): Int {
        val vertexShader = loadShader(GLES20.GL_VERTEX_SHADER, vertexShaderName)
        val fragmentShader = loadShader(GLES20.GL_FRAGMENT_SHADER, fragmentShaderName)

        val program = GLES20.glCreateProgram()
        GLES20.glAttachShader(program, vertexShader)
        GLES20.glAttachShader(program, fragmentShader)
        GLES20.glLinkProgram(program)

        val linkStatus = IntArray(1)
        GLES20.glGetProgramiv(program, GLES20.GL_LINK_STATUS, linkStatus, 0)

        if (linkStatus[0] == 0) {
            GLES20.glDeleteProgram(program)
            throw RuntimeException("Could not link program: ${GLES20.glGetProgramInfoLog(program)}")
        }

        return program
    }

    private fun loadShader(type: Int, shaderName: String): Int {
        val shaderCode = readShaderFile(shaderName)
        val shader = GLES20.glCreateShader(type)
        GLES20.glShaderSource(shader, shaderCode)
        GLES20.glCompileShader(shader)

        val compileStatus = IntArray(1)
        GLES20.glGetShaderiv(shader, GLES20.GL_COMPILE_STATUS, compileStatus, 0)

        if (compileStatus[0] == 0) {
            GLES20.glDeleteShader(shader)
            throw RuntimeException("Could not compile shader: ${GLES20.glGetShaderInfoLog(shader)}")
        }

        return shader
    }

    private fun readShaderFile(fileName: String): String {
        val stringBuilder = StringBuilder()
        try {
            val inputStream = context.assets.open("shaders/$fileName")
            val reader = BufferedReader(InputStreamReader(inputStream))
            var line: String?
            while (reader.readLine().also { line = it } != null) {
                stringBuilder.append(line).append("\n")
            }
            reader.close()
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return stringBuilder.toString()
    }

    fun setUniformFloat(program: Int, name: String, value: Float) {
        val location = GLES20.glGetUniformLocation(program, name)
        GLES20.glUniform1f(location, value)
    }

    fun setUniformInt(program: Int, name: String, value: Int) {
        val location = GLES20.glGetUniformLocation(program, name)
        GLES20.glUniform1i(location, value)
    }

    fun setUniformMatrix4f(program: Int, name: String, matrix: FloatArray) {
        val location = GLES20.glGetUniformLocation(program, name)
        GLES20.glUniformMatrix4fv(location, 1, false, matrix, 0)
    }
}
