// Constantes de formularios

export const INITIAL_USER_FORM = {
    name: '',
    city: '',
    province: '',
    phone_number: '',
    role: 'user'
};

export const INITIAL_EVENT_FORM = {
    name: '',
    description: '',
    location: '',
    date: '',
    url_passline: '',
    url_image: ''
};

// Constantes de paginación
export const USERS_PER_PAGE = 10;
export const EVENTS_PER_PAGE = 10;

// Mensajes
export const MESSAGES = {
    LOADING_USERS: 'Cargando usuarios',
    LOADING_EVENTS: 'Cargando eventos',
    ERROR_LOADING_USERS: 'Error al cargar usuarios',
    ERROR_LOADING_EVENTS: 'Error al cargar eventos',
    NO_USERS_FOUND: 'No se encontraron usuarios',
    NO_EVENTS_FOUND: 'No se encontraron eventos',
    CONFIRM_BAN: '¿Estás seguro que deseas banear al usuario',
    CONFIRM_UNBAN: '¿Estás seguro que deseas desbanear al usuario',
    CONFIRM_DELETE_EVENT: '¿Estás seguro de que deseas eliminar el evento',
    BAN_WARNING: 'Esta acción impedirá que el usuario acceda al sistema.',
    UNBAN_INFO: 'Esta acción permitirá que el usuario vuelva a acceder al sistema.',
    DELETE_WARNING: 'Esta acción no se puede deshacer.'
};
