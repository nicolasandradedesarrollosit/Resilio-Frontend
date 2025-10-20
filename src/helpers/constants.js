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

export const INITIAL_BENEFIT_FORM = {
    name: '',
    q_of_codes: null,
    id_business: null,
    discount: null
};

export const INITIAL_BUSINESS_FORM = {
    name: '',
    description: '',
    location: '',
    phone: '',
    url_image: ''
};

export const USERS_PER_PAGE = 10;
export const EVENTS_PER_PAGE = 10;
export const BENEFITS_PER_PAGE = 10;
export const BUSINESS_PER_PAGE = 10;

export const MESSAGES = {
    LOADING_USERS: 'Cargando usuarios',
    LOADING_EVENTS: 'Cargando eventos',
    LOADING_BENEFITS: 'Cargando beneficios',
    LOADING_BUSINESS: 'Cargando negocios',
    ERROR_LOADING_USERS: 'Error al cargar usuarios',
    ERROR_LOADING_EVENTS: 'Error al cargar eventos',
    ERROR_LOADING_BENEFITS: 'Error al cargar beneficios',
    ERROR_LOADING_BUSINESS: 'Error al cargar negocios',
    NO_USERS_FOUND: 'No se encontraron usuarios',
    NO_EVENTS_FOUND: 'No se encontraron eventos',
    NO_BENEFITS_FOUND: 'No se encontraron beneficios',
    NO_BUSINESS_FOUND: 'No se encontraron negocios',
    CONFIRM_BAN: '¿Estás seguro que deseas banear al usuario',
    CONFIRM_UNBAN: '¿Estás seguro que deseas desbanear al usuario',
    CONFIRM_DELETE_EVENT: '¿Estás seguro de que deseas eliminar el evento',
    CONFIRM_DELETE_BENEFIT: '¿Estás seguro de que deseas eliminar el beneficio',
    CONFIRM_DELETE_BUSINESS: '¿Estás seguro de que deseas eliminar el negocio',
    BAN_WARNING: 'Esta acción impedirá que el usuario acceda al sistema.',
    UNBAN_INFO: 'Esta acción permitirá que el usuario vuelva a acceder al sistema.',
    DELETE_WARNING: 'Esta acción no se puede deshacer.'
};
