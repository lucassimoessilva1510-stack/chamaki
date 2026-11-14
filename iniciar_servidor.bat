@echo off
title ChamaKi — Servidor Local (Porta 8000)
color 0A
cd /d "%~dp0"
echo ========================================================
echo         ChamaKi - Servidor de Help Desk TI
echo ========================================================
echo.
echo [*] Servidor rodando com sucesso!
echo.
echo  - Acesse no seu navegador:
echo    -^> http://localhost:8000
echo    -^> http://127.0.0.1:8000
echo.
echo [*] Se estiver conectado na rede Wi-Fi/rede local:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    for /f "tokens=1 delims= " %%b in ("%%a") do (
        echo    -^> http://%%b:8000
    )
)
echo.
echo Para encerrar o servidor, feche esta janela.
echo ========================================================
echo.

"C:\Users\lucas.simoes\AppData\Local\Programs\Python\Python312\python.exe" server.py
pause
