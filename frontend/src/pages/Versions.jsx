import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Card } from '../components/Card';
import Button from '../components/Button';
import { History } from 'lucide-react';

// Simplified Versions page since the backend logic is complex and might rely on specific client contexts
const Versions = () => {
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVersions();
    }, []);

    const fetchVersions = async () => {
        try {
            // get main versions list
            const response = await api.get('/versions.php');
            setVersions(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Falha ao carregar versões', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Controle de Versões</h1>
                <Button disabled>
                    Nova Versão (Em Breve)
                </Button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-medium">
                            <tr>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Sistema</th>
                                <th className="px-6 py-4">Versão</th>
                                <th className="px-6 py-4">Ambiente</th>
                                <th className="px-6 py-4">Atualizado Em</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center">Carregando...</td></tr>
                            ) : versions.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center">Nenhuma versão encontrada.</td></tr>
                            ) : (
                                versions.map((v) => (
                                    <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {v.clients?.name || 'Cliente Desconhecido'}
                                        </td>
                                        <td className="px-6 py-4">{v.system}</td>
                                        <td className="px-6 py-4 font-bold text-indigo-600">{v.version}</td>
                                        <td className="px-6 py-4">{v.environment}</td>
                                        <td className="px-6 py-4">
                                            {new Date(v.updated_at).toLocaleDateString('pt-BR')}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Versions;
