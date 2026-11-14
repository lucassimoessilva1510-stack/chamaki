@echo off
title Enviando ChamaKi para o GitHub
color 0A
cd /d "%~dp0"
echo ========================================================
echo         ChamaKi - Envio para o GitHub
echo ========================================================
echo.
echo Repositorio de destino:
echo https://github.com/lucassimoessilva1510-stack/chamaki.git
echo.
echo Executando: git push -u origin main ...
echo.
echo (Se abrir uma janela no seu navegador pedindo autorizacao do GitHub, clique em Authorize / Sign In)
echo.
git push -u origin main
echo.
echo ========================================================
if %ERRORLEVEL% equ 0 (
    echo [SUCESSO] Projeto enviado para o GitHub com sucesso!
) else (
    echo [AVISO] Se nao concluiu, faca login no GitHub e tente novamente.
)
echo ========================================================
echo.
pause
