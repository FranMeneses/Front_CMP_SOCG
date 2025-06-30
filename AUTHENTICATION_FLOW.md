# 🔐 Flujo de Autenticación Implementado

## 📋 **Resumen del Sistema**

El sistema de autenticación está diseñado con **separación clara** entre auto-registro público y gestión administrativa de usuarios.

## 🔄 **Flujos Principales**

### **1. 👤 Auto-registro de Usuarios (Público)**

**Endpoint usado:** `auth/register`
**Autenticación requerida:** NO
**Proceso:**
1. Usuario visita la página de registro
2. Llena formulario (email, password, nombre, organización)
3. Frontend envía mutation `REGISTER` (sin id_rol)
4. Backend asigna rol automáticamente:
   - **Primer usuario → Admin (rol 1)**
   - **Usuarios posteriores → Usuario básico (rol 11)**
5. Backend retorna token + datos del usuario
6. Frontend auto-autentica al usuario
7. Redirección automática según rol asignado

### **2. 🔑 Inicio de Sesión**

**Endpoint usado:** `auth/login`
**Autenticación requerida:** NO
**Proceso:**
1. Usuario ingresa credenciales
2. Backend valida email/password
3. Backend actualiza last_login
4. Backend retorna token + datos del usuario
5. Frontend guarda token y datos
6. Redirección según rol del usuario

### **3. 🛡️ Gestión de Usuarios (Administrativa)**

**Endpoint usado:** `users/createUser`, `users/updateUser`, etc.
**Autenticación requerida:** SÍ (Solo Admin/Gerente)
**Proceso:**
1. Admin/Gerente logueado accede a gestión de usuarios
2. Ve lista de usuarios registrados
3. Puede cambiar roles de usuarios existentes
4. Puede activar/desactivar usuarios
5. Puede crear usuarios administrativamente (opcional)

## 🎯 **Separación de Responsabilidades**

| Función | Endpoint | Guards | Quién puede usarlo |
|---------|----------|--------|--------------------|
| **Auto-registro** | `auth/register` | Ninguno | Cualquier persona |
| **Login** | `auth/login` | Ninguno | Usuarios registrados |
| **Ver usuarios** | `users/findAll` | JWT + Roles | Admin/Gerente |
| **Actualizar usuario** | `users/updateUser` | JWT + Roles | Admin/Gerente |
| **Crear usuario (admin)** | `users/createUser` | JWT + Roles | Admin/Gerente |
| **Eliminar usuario** | `users/removeUser` | JWT + Roles | Solo Admin |

## 🔧 **Configuración Técnica**

### **Frontend:**
- **Auto-registro:** Usa mutation `REGISTER`
- **Login:** Usa mutation `LOGIN`
- **Gestión admin:** Usa mutations `CREATE_USER`, `UPDATE_USER`, etc.
- **Headers JWT:** Se envían automáticamente en todas las requests
- **Token storage:** localStorage + cookies para middleware

### **Backend:**
- **Auto-registro:** Sin guards, lógica automática de roles
- **Gestión admin:** Con JwtAuthGuard + RolesGuard
- **JWT payload:** `{ email, sub, rol, id_rol }`
- **Asignación de roles:** Automática en registro, manual en gestión

## ✅ **Estado Final**

El sistema cumple con todos los requisitos:
- ✅ Cualquier persona puede auto-registrarse
- ✅ Primer usuario se vuelve Admin automáticamente
- ✅ Usuarios posteriores son Usuario básico por defecto
- ✅ Admin puede gestionar roles de usuarios existentes
- ✅ Separación clara entre registro público y gestión administrativa
- ✅ Seguridad implementada con JWT + Guards por roles 