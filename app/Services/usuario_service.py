from app.Model.usuario import Usuario

usuarios = []

def crear_usuario(usuario: Usuario):
    usuarios.append(usuario)
    return {"mensaje": "Usuario registrado", "usuario": usuario}