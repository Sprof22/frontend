"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPost() {
    const { id } = useParams();
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        body: "",
        status: "active",
    });

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const accessToken = await fetch('/api/access').then(res => res.json());

                const response = await fetch(`/api/posts?id=${id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                if (!response.ok) throw new Error('Failed to fetch post');
                setFormData(await response.json());
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };
        fetchPost();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const accessToken = await fetch('/api/access').then(res => res.json());

            const response = await fetch(`/api/posts?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to update post');
            router.push('/dashboard');
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Project</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Project title"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.body}
                            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                            placeholder="Project description"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <button
                            type="button"
                            onClick={() => router.push('/dashboard')}
                            className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Update Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}