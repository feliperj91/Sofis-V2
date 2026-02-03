import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, Search, Building2 } from 'lucide-react';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        document: '',
        isbt_code: '',
        notes: ''
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await api.get('/clients.php');
            setClients(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Falha ao carregar clientes', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (client = null) => {
        if (client) {
            setEditingClient(client);
            setFormData({
                name: client.name,
                document: client.document || '',
                isbt_code: client.isbt_code || '',
                notes: client.notes || ''
            });
        } else {
            setEditingClient(null);
            setFormData({
                name: '',
                document: '',
                isbt_code: '',
                notes: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingClient(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Basic payload for now, complex fields would need dedicated UI sections
            const payload = {
                ...formData,
                contacts: [],
                servers: [],
                vpns: [],
                hosts: [],
                urls: []
            };

            if (editingClient) {
                // Preserve existing complex data on edit if we aren't editing it yet
                // In a real app we'd load this data fully or handle partial updates better
                await api.put(`/clients.php?id=${editingClient.id}`, {
                    ...payload,
                    contacts: editingClient.contacts,
                    servers: editingClient.servers,
                    vpns: editingClient.vpns,
                    hosts: editingClient.hosts,
                    urls: editingClient.urls
                });
            } else {
                await api.post('/clients.php', payload);
            }
            fetchClients();
            handleCloseModal();
        } catch (error) {
            alert('Erro ao salvar cliente: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            try {
                await api.delete(`/clients.php?id=${id}`);
                fetchClients();
            } catch (error) {
                alert('Erro ao excluir: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.document && client.document.includes(searchTerm))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Clientes</h1>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Cliente
                </Button>
            </div>

            <Card>
                <div className="p-4 border-b border-gray-200">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Buscar por nome ou documento..."
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
                                <th className="px-6 py-4">Nome</th>
                                <th className="px-6 py-4">Documento</th>
                                <th className="px-6 py-4">Cód. ISBT</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="4" className="px-6 py-8 text-center">Carregando...</td></tr>
                            ) : filteredClients.length === 0 ? (
                                <tr><td colSpan="4" className="px-6 py-8 text-center">Nenhum cliente encontrado.</td></tr>
                            ) : (
                                filteredClients.map((client) => (
                                    <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                                            <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                                            {client.name}
                                        </td>
                                        <td className="px-6 py-4">{client.document || '-'}</td>
                                        <td className="px-6 py-4">{client.isbt_code || '-'}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => handleOpenModal(client)} className="text-indigo-600 hover:text-indigo-900" title="Editar">
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(client.id)} className="text-red-600 hover:text-red-900" title="Excluir">
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
                title={editingClient ? 'Editar Cliente' : 'Novo Cliente'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nome do Cliente"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Documento (CNPJ/CPF)"
                        value={formData.document}
                        onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                    />
                    <Input
                        label="Código ISBT"
                        value={formData.isbt_code}
                        onChange={(e) => setFormData({ ...formData, isbt_code: e.target.value })}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                        <textarea
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            rows={3}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-md">
                        <p className="text-sm text-blue-700">
                            Nota: A gestão de contatos, servidores e VPNs será adicionada em uma atualização futura.
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {editingClient ? 'Salvar Alterações' : 'Criar Cliente'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Clients;
