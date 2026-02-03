import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, Search, CheckCircle, XCircle } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        password: '',
        roles: 'TECNICO', // Simple selection for now
        is_active: true
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users.php');
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Falha ao carregar usuários', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                username: user.username,
                full_name: user.full_name || '',
                password: '', // Don't fill password on edit
                roles: user.roles && user.roles.length > 0 ? user.roles[0] : 'TECNICO',
                is_active: user.is_active
            });
        } else {
            setEditingUser(null);
            setFormData({
                username: '',
                full_name: '',
                password: '',
                roles: 'TECNICO',
                is_active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                // Edit mode (PUT)
                await api.put(`/users.php?id=${editingUser.id}`, {
                    full_name: formData.full_name,
                    roles: [formData.roles],
                    is_active: formData.is_active,
                    ...(formData.password ? { password: formData.password } : {})
                });
            } else {
                // Create mode (POST)
                await api.post('/users.php', {
                    username: formData.username,
                    full_name: formData.full_name,
                    password: formData.password,
                    roles: [formData.roles]
                });
            }
            fetchUsers();
            handleCloseModal();
        } catch (error) {
            alert('Erro ao salvar usuário: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                await api.delete(`/users.php?id=${id}`);
                fetchUsers();
            } catch (error) {
                alert('Erro ao excluir: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Usuário
                </Button>
            </div>

            <Card>
                <div className="p-4 border-b border-gray-200">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Buscar por nome ou usuário..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-medium">
                            <tr>
                                <th className="px-6 py-4">Usuário</th>
                                <th className="px-6 py-4">Nome Completo</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Papel</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center">Carregando...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center">Nenhum usuário encontrado.</td></tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{user.username}</td>
                                        <td className="px-6 py-4">{user.full_name || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {user.is_active ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.roles ? user.roles.join(', ') : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => handleOpenModal(user)} className="text-indigo-600 hover:text-indigo-900" title="Editar">
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900" title="Excluir">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nome de Usuário"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                        disabled={!!editingUser} // Prevent changing username on edit usually
                    />
                    <Input
                        label="Nome Completo"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                    <Input
                        label={editingUser ? "Nova Senha (deixe em branco para manter)" : "Senha"}
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required={!editingUser}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Papel</label>
                        <select
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            value={formData.roles}
                            onChange={(e) => setFormData({ ...formData, roles: e.target.value })}
                        >
                            <option value="TECNICO">Técnico</option>
                            <option value="ADMIN">Administrador</option>
                            {/* Add more roles as needed based on checking roles.php */}
                        </select>
                    </div>

                    {editingUser && (
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_active" className="text-sm text-gray-700">Usuário Ativo</label>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Users;
