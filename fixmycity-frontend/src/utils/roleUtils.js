export const getDashboardPath = (role) => {
    switch (role) {
        case 'admin':
            return '/admin/dashboard';
        case 'agent':
            return '/agent/dashboard';
        case 'citizen':
        default:
            return '/dashboard';
    }
};
