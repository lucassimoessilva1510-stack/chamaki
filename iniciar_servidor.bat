@echo off
title ChamaKi — Servidor Local (Porta 8000)
color 0A
cd /d "%~dp0"
echo ========================================================
echo         ChamaKi - Servidor de Help Desk TI
echo ========================================================
echo.
echo [*] Iniciando servidor em http://localhost:8000 ...
echo [*] Outros computadores na rede podem acessar pelo seu IP:
echo     http://10.130.10.49:8000
echo.
echo Para fechar o servidor, feche esta janela.
echo ========================================================
echo.

"C:\Users\lucas.simoes\AppData\Local\Programs\Python\Python312\python.exe" server.py
pause
