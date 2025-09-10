// src/config/quickActions.js
import { ROLES } from '../constants/roles';

export const QUICK_ACTIONS = {
  [ROLES.CLIENT]: [
    { key: 'bookService', icon: '🔧', title: 'Book Service', subtitle: 'Schedule maintenance' },
    { key: 'addVehicle', icon: '🚗', title: 'Add Vehicle', subtitle: 'Manage your fleet' },
  ],
};
