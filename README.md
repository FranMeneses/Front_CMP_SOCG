This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Frontend CMP Sociedad

## Mejoras Recientes - Actualización Automática de Subtareas

### Cambios Implementados

Se han realizado las siguientes modificaciones para que la tabla de subtareas se actualice automáticamente al crear, actualizar o eliminar subtareas sin necesidad de recargar la página:

#### 1. Configuración Mejorada de Apollo Client (`src/lib/apolloClient.ts`)
- Configuración optimizada del cache con `typePolicies` para manejar correctamente las actualizaciones
- Políticas de fetch mejoradas para consultas y mutaciones
- Manejo automático de errores

#### 2. Mutaciones Optimizadas (`src/app/features/planification/hooks/useValleySubtasksForm.ts`)
- Eliminación de `window.location.reload()` en todas las operaciones CRUD
- Implementación de `refetchQueries` para actualizar automáticamente las consultas relacionadas
- Callback de éxito para notificar cuando se complete una operación
- Manejo mejorado del cache de Apollo Client

#### 3. Hook de Planificación Mejorado (`src/app/features/planification/hooks/usePlanification.ts`)
- Eliminación de recargas de página innecesarias
- Refetch automático después de operaciones exitosas
- Callback de éxito integrado para actualizaciones automáticas

#### 4. Hook de Datos de Tareas Optimizado (`src/app/features/planification/hooks/useTaskData.ts`)
- Función `refetch` mejorada que actualiza tanto tareas como subtareas
- Dependencias de useEffect optimizadas para detectar cambios en subtareas
- Manejo más eficiente de las actualizaciones de datos

### Beneficios

- **Mejor Experiencia de Usuario**: No más recargas de página al crear/editar subtareas
- **Rendimiento Mejorado**: Actualizaciones más rápidas y eficientes
- **Consistencia de Datos**: El cache de Apollo Client mantiene los datos sincronizados
- **Menor Carga del Servidor**: Menos requests innecesarios al servidor

### Funcionalidades

- ✅ Crear subtareas sin recargar la página
- ✅ Editar subtareas sin recargar la página  
- ✅ Eliminar subtareas sin recargar la página
- ✅ Actualización automática del contador de subtareas
- ✅ Actualización automática de los detalles de las tareas
- ✅ Manejo de errores mejorado

###
-HOLA