import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import {
    Users,
    LayoutDashboard,
    Package,
    History,
    ShieldCheck,
    LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Usuários', path: '/users' },
        { icon: Users, label: 'Clientes', path: '/clients' },
        { icon: Package, label: 'Produtos', path: '/products' },
        { icon: History, label: 'Versões', path: '/versions' },
        { icon: ShieldCheck, label: 'Auditoria', path: '/audit' },
    ];

    return (
        <div className="flex flex-col w-64 bg-dark-bg border-r border-dark-border min-h-screen text-slate-300">
            <div className="flex items-center justify-center h-16 border-b border-dark-border">
                <h1 className="text-xl font-bold text-white">Projeto SOFIS</h1>
            </div>

            <nav className="flex-1 px-2 py-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(
                                'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
                                isActive
                                    ? 'bg-primary-600 text-white'
                                    : 'hover:bg-dark-surface hover:text-white'
                            )
                        }
                    >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-dark-border">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-400 rounded-md hover:bg-dark-surface hover:text-red-300 transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sair
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
