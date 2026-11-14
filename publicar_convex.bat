@echo off
title ChamaKi — Sincronizar Banco Convex Cloud
color 0B
cd /d "%~dp0"
echo ========================================================
echo       ChamaKi - Conexao com Convex Cloud
echo ========================================================
echo.
echo [*] Conectando ao seu banco de dados na nuvem:
echo     URL: https://laudable-mink-785.convex.cloud
echo.
set PATH=C:\Users\lucas.simoes\AppData\Roaming\fnm\node-versions\v26.13.1\installation;%PATH%
echo [*] Executando publicacao das funcoes e schema...
echo (Se for a primeira vez, o navegador vai abrir para autorizar o login)
echo.
call npx convex dev --once
echo.
echo [*] Povoando banco com usuarios e chamados iniciais...
call npx convex run seed:seedData
echo.
echo ========================================================
echo [*] Banco de dados Convex sincronizado com sucesso!
echo ========================================================
pause
