@echo off
title ChamaKi — Visualizar Banner Científico (90x120cm)
color 0E
cd /d "%~dp0"
echo ========================================================
echo       ChamaKi - Banner Científico Expo São Judas
echo ========================================================
echo.
echo [*] Abrindo o banner no seu navegador padrão...
echo [*] Para salvar em PDF ou imprimir no tamanho 90x120cm:
echo     1. Pressione Ctrl + P (ou clique no botão laranja no topo)
echo     2. Em Destino, escolha "Salvar como PDF"
echo     3. Em Mais definições, marque "Gráficos de segundo plano"
echo.
start "" "%~dp0banner.html"
exit
