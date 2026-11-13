import http.server
import socketserver
import json
import os
import sys
from datetime import datetime

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "database.json")

def get_initial_data():
    techs = [
        {"name": "Ícaro Rafael Borges", "email": "icaro@empresa.com", "dept": "TI", "cargo": "Product Owner", "type": "tec", "password": "123", "avatar": ""},
        {"name": "Lucas Simões Silva", "email": "lucas@empresa.com", "dept": "TI", "cargo": "Desenvolvedor", "type": "tec", "password": "123", "avatar": ""},
        {"name": "Maria Eduarda F. da F. Silva", "email": "maria@empresa.com", "dept": "TI", "cargo": "Scrum Master", "type": "tec", "password": "123", "avatar": ""},
        {"name": "Matheus Polini", "email": "matheus@empresa.com", "dept": "TI", "cargo": "Desenvolvedor / DBA", "type": "tec", "password": "123", "avatar": ""}
    ]
    clients = [
        {"name": "Ana Costa", "email": "ana@gmail.com", "type": "cli", "password": "123", "avatar": ""},
        {"name": "Carlos Mendes", "email": "carlos@outlook.com", "type": "cli", "password": "123", "avatar": ""},
        {"name": "Fernanda Lima", "email": "fernanda@gmail.com", "type": "cli", "password": "123", "avatar": ""},
        {"name": "Roberto Alves", "email": "roberto@hotmail.com", "type": "cli", "password": "123", "avatar": ""},
        {"name": "Juliana Martins", "email": "juliana@gmail.com", "type": "cli", "password": "123", "avatar": ""},
        {"name": "Pedro Santos", "email": "pedro@yahoo.com", "type": "cli", "password": "123", "avatar": ""}
    ]
    tickets = [
        {
            "ticketId": "CHK-001",
            "title": "Impressora HP LaserJet não liga — 3º andar",
            "category": "Impressora",
            "priority": "high",
            "status": "Aberto",
            "authorName": "Ana Costa",
            "authorEmail": "ana@gmail.com",
            "assigneeName": None,
            "photo": None,
            "createdTime": "2026-10-15T09:30:00",
            "timeline": [{"time": "15/10 09:30", "message": "Chamado registrado por Ana Costa — impressora sem resposta ao ligar.", "type": "file"}]
        },
        {
            "ticketId": "CHK-002",
            "title": "VPN corporativa desconecta após 10 minutos",
            "category": "Rede / VPN",
            "priority": "crit",
            "status": "Em Atendimento",
            "authorName": "Carlos Mendes",
            "authorEmail": "carlos@outlook.com",
            "assigneeName": "Matheus Polini",
            "photo": None,
            "createdTime": "2026-10-16T14:00:00",
            "timeline": [
                {"time": "16/10 14:00", "message": "Chamado registrado por Carlos Mendes — VPN desconecta automaticamente.", "type": "file"},
                {"time": "16/10 15:20", "message": "Chamado assumido por Matheus Polini.", "type": "wrench"},
                {"time": "17/10 10:00", "message": "Matheus Polini: Verificando configurações de firewall corporativo e logs do servidor.", "type": "msg"}
            ]
        },
        {
            "ticketId": "CHK-003",
            "title": "Monitor externo sem sinal — cabo HDMI",
            "category": "Hardware",
            "priority": "med",
            "status": "Resolvido",
            "authorName": "Fernanda Lima",
            "authorEmail": "fernanda@gmail.com",
            "assigneeName": "Lucas Simões Silva",
            "photo": None,
            "createdTime": "2026-10-14T08:45:00",
            "timeline": [
                {"time": "14/10 08:45", "message": "Chamado registrado por Fernanda Lima.", "type": "file"},
                {"time": "14/10 10:00", "message": "Chamado assumido por Lucas Simões Silva.", "type": "wrench"},
                {"time": "14/10 11:30", "message": "Lucas Simões: Cabo HDMI substituído. Monitor funcionando perfeitamente.", "type": "msg"},
                {"time": "14/10 11:45", "message": "Chamado resolvido com sucesso.", "type": "check"}
            ]
        },
        {
            "ticketId": "CHK-004",
            "title": "Acesso negado ao sistema ERP — módulo financeiro",
            "category": "Acesso / Permissões",
            "priority": "high",
            "status": "Aberto",
            "authorName": "Roberto Alves",
            "authorEmail": "roberto@hotmail.com",
            "assigneeName": None,
            "photo": None,
            "createdTime": "2026-10-18T07:50:00",
            "timeline": [{"time": "18/10 07:50", "message": "Chamado registrado — erro de autenticação em contas a pagar.", "type": "file"}]
        },
        {
            "ticketId": "CHK-005",
            "title": "Licença Office 365 não ativa no notebook",
            "category": "Software",
            "priority": "med",
            "status": "Em Atendimento",
            "authorName": "Juliana Martins",
            "authorEmail": "juliana@gmail.com",
            "assigneeName": "Maria Eduarda F. da F. Silva",
            "photo": None,
            "createdTime": "2026-10-17T13:00:00",
            "timeline": [
                {"time": "17/10 13:00", "message": "Chamado registrado por Juliana Martins.", "type": "file"},
                {"time": "17/10 16:00", "message": "Chamado assumido por Maria Eduarda F. da F. Silva.", "type": "wrench"}
            ]
        },
        {
            "ticketId": "CHK-006",
            "title": "Teclado USB — teclas Enter e Espaço falhando",
            "category": "Hardware",
            "priority": "low",
            "status": "Aberto",
            "authorName": "Pedro Santos",
            "authorEmail": "pedro@yahoo.com",
            "assigneeName": None,
            "photo": None,
            "createdTime": "2026-10-19T11:00:00",
            "timeline": [{"time": "19/10 11:00", "message": "Chamado registrado — teclas travando intermitentemente.", "type": "file"}]
        },
        {
            "ticketId": "CHK-007",
            "title": "E-mail não recebe anexos acima de 5 MB",
            "category": "E-mail",
            "priority": "med",
            "status": "Aberto",
            "authorName": "Ana Costa",
            "authorEmail": "ana@gmail.com",
            "assigneeName": None,
            "photo": None,
            "createdTime": "2026-10-20T08:15:00",
            "timeline": [{"time": "20/10 08:15", "message": "Chamado registrado — mensagens rejeitadas com erro 552.", "type": "file"}]
        },
        {
            "ticketId": "CHK-008",
            "title": "Sistema de ponto eletrônico fora do ar",
            "category": "Sistema Interno",
            "priority": "crit",
            "status": "Em Atendimento",
            "authorName": "Roberto Alves",
            "authorEmail": "roberto@hotmail.com",
            "assigneeName": "Ícaro Rafael Borges",
            "photo": None,
            "createdTime": "2026-10-20T09:00:00",
            "timeline": [
                {"time": "20/10 09:00", "message": "URGENTE: Ponto eletrônico indisponível para toda a equipe.", "type": "alert"},
                {"time": "20/10 09:15", "message": "Chamado assumido por Ícaro Rafael Borges — prioridade máxima.", "type": "wrench"},
                {"time": "20/10 10:30", "message": "Ícaro: Servidor de ponto reiniciado. Validando banco de dados.", "type": "msg"}
            ]
        },
        {
            "ticketId": "CHK-009",
            "title": "Setup de notebook novo — SO e aplicativos",
            "category": "Software",
            "priority": "low",
            "status": "Resolvido",
            "authorName": "Juliana Martins",
            "authorEmail": "juliana@gmail.com",
            "assigneeName": "Matheus Polini",
            "photo": None,
            "createdTime": "2026-10-12T14:00:00",
            "timeline": [
                {"time": "12/10 14:00", "message": "Chamado registrado para novo colaborador.", "type": "file"},
                {"time": "12/10 15:00", "message": "Chamado assumido por Matheus Polini.", "type": "wrench"},
                {"time": "13/10 09:00", "message": "Matheus: Windows 11, Office, Antivírus e VPN configurados.", "type": "msg"},
                {"time": "13/10 09:30", "message": "Chamado resolvido com sucesso.", "type": "check"}
            ]
        },
        {
            "ticketId": "CHK-010",
            "title": "Wi-Fi com sinal fraco no 2º andar — vídeo trava",
            "category": "Rede / VPN",
            "priority": "med",
            "status": "Aberto",
            "authorName": "Fernanda Lima",
            "authorEmail": "fernanda@gmail.com",
            "assigneeName": None,
            "photo": None,
            "createdTime": "2026-10-21T10:30:00",
            "timeline": [{"time": "21/10 10:30", "message": "Chamado registrado — quedas durante videoconferências.", "type": "file"}]
        },
        {
            "ticketId": "CHK-011",
            "title": "Projetor da sala de reuniões não conecta via HDMI",
            "category": "Hardware",
            "priority": "med",
            "status": "Resolvido",
            "authorName": "Carlos Mendes",
            "authorEmail": "carlos@outlook.com",
            "assigneeName": "Lucas Simões Silva",
            "photo": None,
            "createdTime": "2026-10-10T16:00:00",
            "timeline": [
                {"time": "10/10 16:00", "message": "Chamado registrado por Carlos Mendes.", "type": "file"},
                {"time": "10/10 16:30", "message": "Chamado assumido por Lucas Simões Silva.", "type": "wrench"},
                {"time": "10/10 17:15", "message": "Lucas: Adaptador HDMI substituído. Teste OK.", "type": "check"}
            ]
        },
        {
            "ticketId": "CHK-012",
            "title": "Criação de conta AD para novo colaborador — início 24/10",
            "category": "Acesso / Permissões",
            "priority": "high",
            "status": "Aberto",
            "authorName": "Ana Costa",
            "authorEmail": "ana@gmail.com",
            "assigneeName": None,
            "photo": None,
            "createdTime": "2026-10-22T08:00:00",
            "timeline": [{"time": "22/10 08:00", "message": "Chamado registrado — cadastro de usuário e e-mail corporativo.", "type": "file"}]
        }
    ]
    return {"users": techs + clients, "tickets": tickets, "counter": 12}

def load_db():
    if not os.path.exists(DB_FILE):
        data = get_initial_data()
        save_db(data)
        return data
    try:
        with open(DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        data = get_initial_data()
        save_db(data)
        return data

def save_db(data):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

class ChamaKiHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PATCH, PUT, DELETE")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_json_body(self):
        length = int(self.headers.get("Content-Length", 0))
        if length <= 0:
            return {}
        raw = self.rfile.read(length).decode("utf-8")
        return json.loads(raw)

    def do_GET(self):
        path = self.path.split("?")[0]

        if path == "/api/tickets":
            db = load_db()
            self.send_json(200, db.get("tickets", []))
            return

        if path == "/api/status":
            self.send_json(200, {"status": "online", "time": datetime.now().isoformat()})
            return

        super().do_GET()

    def do_POST(self):
        path = self.path.split("?")[0]
        try:
            body = self.read_json_body()
        except Exception as e:
            self.send_json(400, {"error": "JSON inválido: " + str(e)})
            return

        db = load_db()

        if path == "/api/auth/login":
            email = body.get("email", "").strip().lower()
            password = body.get("password", "")
            users = db.get("users", [])
            user = next((u for u in users if u.get("email", "").lower() == email), None)

            if not user:
                self.send_json(401, {"error": "E-mail não cadastrado."})
                return
            if user.get("password") and user.get("password") != password:
                self.send_json(401, {"error": "Senha incorreta."})
                return

            self.send_json(200, {
                "name": user["name"],
                "email": user["email"],
                "type": user["type"],
                "dept": user.get("dept", "—"),
                "cargo": user.get("cargo", "—"),
                "avatar": user.get("avatar", "")
            })
            return

        if path == "/api/auth/register":
            email = body.get("email", "").strip().lower()
            users = db.get("users", [])
            if any(u.get("email", "").lower() == email for u in users):
                self.send_json(400, {"error": "Este e-mail já está em uso."})
                return

            new_user = {
                "name": body.get("name", "").strip(),
                "email": email,
                "password": body.get("password", ""),
                "type": body.get("type", "cli"),
                "dept": body.get("dept", "—"),
                "cargo": body.get("cargo", "—"),
                "avatar": ""
            }
            users.append(new_user)
            db["users"] = users
            save_db(db)
            self.send_json(200, new_user)
            return

        if path == "/api/auth/profile":
            email = body.get("email", "").strip().lower()
            users = db.get("users", [])
            user = next((u for u in users if u.get("email", "").lower() == email), None)
            if not user:
                self.send_json(404, {"error": "Usuário não encontrado."})
                return
            if "name" in body and body["name"]:
                user["name"] = body["name"]
            if "dept" in body:
                user["dept"] = body["dept"]
            if "cargo" in body:
                user["cargo"] = body["cargo"]
            if "avatar" in body:
                user["avatar"] = body["avatar"]
            save_db(db)
            self.send_json(200, user)
            return

        if path == "/api/tickets":
            counter = db.get("counter", 0) + 1
            db["counter"] = counter
            ticket_id = f"CHK-{counter:03d}"
            now_str = datetime.now().strftime("%d/%m %H:%M")

            desc = body.get("description", "").strip()
            msg = f"Chamado registrado por {body.get('authorName', 'Usuário')}"
            if desc:
                msg += f" — {desc}"

            photo = body.get("photo", None)

            new_ticket = {
                "ticketId": ticket_id,
                "title": body.get("title", "Sem título").strip(),
                "category": body.get("category", "Geral"),
                "priority": body.get("priority", "med"),
                "status": "Aberto",
                "authorName": body.get("authorName", "Anônimo"),
                "authorEmail": body.get("authorEmail", ""),
                "assigneeName": None,
                "photo": photo,
                "createdTime": datetime.now().isoformat(),
                "timeline": [{"time": now_str, "message": msg, "type": "file"}]
            }
            db.setdefault("tickets", []).insert(0, new_ticket)
            save_db(db)
            self.send_json(201, new_ticket)
            return

        if path == "/api/tickets/assume":
            ticket_id = body.get("ticketId")
            tech_name = body.get("techName", "Técnico")
            tickets = db.get("tickets", [])
            t = next((x for x in tickets if x.get("ticketId") == ticket_id), None)
            if not t:
                self.send_json(404, {"error": "Chamado não encontrado."})
                return
            t["status"] = "Em Atendimento"
            t["assigneeName"] = tech_name
            now_str = datetime.now().strftime("%d/%m %H:%M")
            t.setdefault("timeline", []).append({
                "time": now_str,
                "message": f"Chamado assumido por {tech_name}.",
                "type": "wrench"
            })
            save_db(db)
            self.send_json(200, t)
            return

        if path == "/api/tickets/resolve":
            ticket_id = body.get("ticketId")
            tickets = db.get("tickets", [])
            t = next((x for x in tickets if x.get("ticketId") == ticket_id), None)
            if not t:
                self.send_json(404, {"error": "Chamado não encontrado."})
                return
            t["status"] = "Resolvido"
            now_str = datetime.now().strftime("%d/%m %H:%M")
            t.setdefault("timeline", []).append({
                "time": now_str,
                "message": "Chamado resolvido com sucesso.",
                "type": "check"
            })
            save_db(db)
            self.send_json(200, t)
            return

        if path == "/api/tickets/reply":
            ticket_id = body.get("ticketId")
            author_name = body.get("authorName", "Usuário")
            message = body.get("message", "").strip()
            photo = body.get("photo", None)
            tickets = db.get("tickets", [])
            t = next((x for x in tickets if x.get("ticketId") == ticket_id), None)
            if not t:
                self.send_json(404, {"error": "Chamado não encontrado."})
                return
            now_str = datetime.now().strftime("%d/%m %H:%M")
            reply_obj = {
                "time": now_str,
                "message": f"{author_name}: {message}",
                "type": "msg"
            }
            if photo:
                reply_obj["photo"] = photo
            t.setdefault("timeline", []).append(reply_obj)
            save_db(db)
            self.send_json(200, t)
            return

        if path == "/api/tickets/delete":
            ticket_id = body.get("ticketId")
            tickets = db.get("tickets", [])
            initial_count = len(tickets)
            db["tickets"] = [t for t in tickets if t.get("ticketId") != ticket_id]
            if len(db["tickets"]) == initial_count:
                self.send_json(404, {"error": "Chamado não encontrado para exclusão."})
                return
            save_db(db)
            self.send_json(200, {"success": True, "ticketId": ticket_id})
            return

        self.send_json(404, {"error": "Endpoint não encontrado."})

def run():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", PORT), ChamaKiHandler) as httpd:
        print(f"🚀 ChamaKi Server ativo em http://localhost:{PORT}")
        print(f"📡 Acesso na rede local via http://0.0.0.0:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nEncerrando servidor...")

if __name__ == "__main__":
    run()
