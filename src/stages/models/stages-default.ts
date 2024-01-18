import { Types } from 'mongoose';
/**
 * default stages
 * @ignore
 */
export const default_stages = [
  {
    _id: new Types.ObjectId('64418ce45aae5f4960eeedcd'),
    index: 0,
    name: 'Onboarding',
    label: 'Mindset',
    color: '#4552A7',
    icon: 'brand-asana',
    description:
      'La etapa de Onboarding te permitirá adquirir el mindset para emprender, desarrollando tus habilidades, generando y aplicando el conocimiento y conectando con otros emprendedores y stakeholders. Durante esta etapa pueden desarrollarse prototipos que no necesariamente son funcionales o viables, pero que sí permiten identificar las soluciones correctas y validar las hipótesis iniciales del proyecto. Es una fase óptima para la experimentación y la exposición de las ideas sin tener que tomar decisiones riesgosas, favoreciendo la práctica de metodologías ágiles e iterativas.',
  },
  {
    _id: new Types.ObjectId('64418df35aae5f4960eeee0c'),
    index: 1,
    name: 'Early stage',
    label: 'Potential',
    color: '#EA4254',
    icon: 'social',
    description:
      'Durante esta etapa, tu idea estará evolucionando para convertirse en un producto o servicio insertado en el mercado; así que se inicia el lanzamiento del producto, aunque no en su versión final, sino que se realizan pruebas para identificar un mínimo producto viable (MVP). Un mínimo producto viable no posee la totalidad de funcionalidades esperadas del producto pero permite realizar pruebas menos complejas con el objetivo de recolectar información de los clientes y usuarios. Idealmente, durante esta etapa, ya existe un equipo conformando la startup capaz de cubrir las tareas clave para la entrega de valor. Es un buen momento para que definas un modelo de negocio inicial, aunque no sea definitivo.',
  },
  {
    _id: new Types.ObjectId('64418e225aae5f4960eeee19'),
    index: 2,
    name: 'Grow stage',
    label: 'Scalability',
    color: '#F8A70B',
    icon: 'plant',
    description: '',
  },
  {
    _id: new Types.ObjectId('64418e4b5aae5f4960eeee2e'),
    index: 3,
    name: 'Late',
    label: 'Performance',
    color: '#B8C53A',
    icon: 'tree',
    description: '',
  },
  {
    _id: new Types.ObjectId('64418e6b5aae5f4960eeee3b'),
    index: 5,
    name: 'Launche',
    label: 'Sharing',
    color: '#DB5F39',
    icon: 'apple',
    description: '',
  },
];
