import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Issues from '../models/Issues';
import bcrypt from 'bcrypt';

// Cargar variables de entorno
dotenv.config();

// Función para conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('✅ Conectado a MongoDB para seed');
    return true;
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    return false;
  }
};

// Función para crear usuarios de prueba
const seedUsers = async () => {
  try {
    // Limpiar colección de usuarios
    await User.deleteMany({});
    console.log('🧹 Colección de usuarios limpiada');

    // Crear contraseñas hasheadas
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password122', salt);

    // Crear usuarios de prueba
    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword
      },
      {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
      },
      {
        name: 'Developer',
        email: 'dev@example.com',
        password: hashedPassword
      }
    ];

    // Insertar usuarios
    const createdUsers = await User.insertMany(users);
    console.log(`✅ ${createdUsers.length} usuarios creados`);
    return createdUsers;
  } catch (error) {
    console.error('❌ Error creando usuarios:', error);
    return [];
  }
};

// Función para crear issues de prueba
const seedIssues = async (users: any[]) => {
  try {
    // Limpiar colección de issues
    await Issues.deleteMany({});
    console.log('🧹 Colección de issues limpiada');

    // Verificar que tenemos usuarios
    if (users.length === 0) {
      console.error('❌ No hay usuarios para asignar a los issues');
      return;
    }

    // Estados y prioridades para los issues
    const statuses = ['open', 'in_progress', 'closed'];
    const priorities = ['low', 'medium', 'high'];

    // Crear issues de prueba
    const issues = [
      {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[1],
    priority: priorities[1],
    createdBy: users[0]._id,
    assignedTo: users[2]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[1],
    priority: priorities[2],
    createdBy: users[0]._id,
    assignedTo: users[2]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[1],
    priority: priorities[2],
    createdBy: users[0]._id,
    assignedTo: users[2]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[2],
    priority: priorities[1],
    createdBy: users[0]._id,
    assignedTo: users[2]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[2],
    priority: priorities[2],
    createdBy: users[0]._id,
    assignedTo: users[2]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[2],
    priority: priorities[2],
    createdBy: users[0]._id,
    assignedTo: users[2]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[2],
    priority: priorities[1],
    createdBy: users[0]._id,
    assignedTo: users[2]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[2],
    priority: priorities[2],
    createdBy: users[0]._id,
    assignedTo: users[2]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[2],
    priority: priorities[2],
    createdBy: users[0]._id,
    assignedTo: users[2]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[1],
    priority: priorities[1],
    createdBy: users[0]._id,
    assignedTo: users[1]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[1],
    priority: priorities[2],
    createdBy: users[0]._id,
    assignedTo: users[1]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[1],
    priority: priorities[2],
    createdBy: users[0]._id,
    assignedTo: users[1]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[2],
    priority: priorities[1],
    createdBy: users[0]._id,
    assignedTo: users[1]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[2],
    priority: priorities[2],
    createdBy: users[0]._id,
    assignedTo: users[1]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[2],
    priority: priorities[2],
    createdBy: users[0]._id,
    assignedTo: users[1]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[2],
    priority: priorities[1],
    createdBy: users[0]._id,
    assignedTo: users[1]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[2],
    priority: priorities[2],
    createdBy: users[0]._id,
    assignedTo: users[1]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[2],
    priority: priorities[2],
    createdBy: users[0]._id,
    assignedTo: users[1]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[1],
    priority: priorities[1],
    createdBy: users[0]._id,
    assignedTo: users[0]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[1],
    priority: priorities[2],
    createdBy: users[0]._id,
    assignedTo: users[0]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[1],
    priority: priorities[2],
    createdBy: users[0]._id,
    assignedTo: users[0]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[2],
    priority: priorities[1],
    createdBy: users[0]._id,
    assignedTo: users[0]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[2],
    priority: priorities[2],
    createdBy: users[0]._id,
    assignedTo: users[0]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[2],
    priority: priorities[2],
    createdBy: users[0]._id,
    assignedTo: users[0]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[2],
    priority: priorities[1],
    createdBy: users[0]._id,
    assignedTo: users[0]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[2],
    priority: priorities[2],
    createdBy: users[0]._id,
    assignedTo: users[0]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[2],
    priority: priorities[2],
    createdBy: users[0]._id,
    assignedTo: users[0]._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[1],
    priority: priorities[1],
    createdBy: users[0]._id,
    assignedTo: users[2]?._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[2],
    priority: priorities[2],
    createdBy: users[0]._id,
    assignedTo: users[2]?._id
  },
  {
    title: 'Implementar filtros de búsqueda',
    description: 'Añadir filtros para buscar issues por estado y prioridad',
    status: statuses[2],
    priority: priorities[2],
    createdBy: users[0]._id,
    assignedTo: users[2]?._id
  },
      {
        title: 'Implementar autenticación',
        description: 'Implementar sistema de login y registro con JWT',
        status: statuses[0],
        priority: priorities[2],
        createdBy: users[0]._id,
        assignedTo: users[1]._id
      },
      {
        title: 'Diseñar interfaz de usuario',
        description: 'Crear diseño responsive para la aplicación',
        status: statuses[1],
        priority: priorities[1],
        createdBy: users[0]._id,
        assignedTo: users[2]._id
      },
      {
        title: 'Optimizar consultas a la base de datos',
        description: 'Mejorar el rendimiento de las consultas a MongoDB',
        status: statuses[2],
        priority: priorities[0],
        createdBy: users[1]._id,
        assignedTo: users[0]._id
      },
      {
        title: 'Corregir bug en formulario',
        description: 'El formulario no valida correctamente los campos',
        status: statuses[0],
        priority: priorities[2],
        createdBy: users[2]._id,
        assignedTo: users[1]._id
      },
      {
        title: 'Implementar filtros de búsqueda',
        description: 'Añadir filtros para buscar issues por estado y prioridad',
        status: statuses[1],
        priority: priorities[1],
        createdBy: users[0]._id,
        assignedTo: users[2]._id
      }
    ];

    // Insertar issues
    const createdIssues = await Issues.insertMany(issues);
    console.log(`✅ ${createdIssues.length} issues creados`);
  } catch (error) {
    console.error('❌ Error creando issues:', error);
  }
};

// Función principal para ejecutar el seed
const runSeed = async () => {
  // Conectar a la base de datos
  const connected = await connectDB();
  if (!connected) {
    console.error('❌ No se pudo conectar a la base de datos. Abortando seed.');
    process.exit(1);
  }

  try {
    // Crear usuarios y luego issues
    const users = await seedUsers();
    await seedIssues(users);
    
    console.log('✅ Seed completado exitosamente');
  } catch (error) {
    console.error('❌ Error durante el proceso de seed:', error);
  } finally {
    // Cerrar conexión a la base de datos
    await mongoose.connection.close();
    console.log('📡 Conexión a MongoDB cerrada');
    process.exit(0);
  }
};

// Ejecutar el seed
runSeed();