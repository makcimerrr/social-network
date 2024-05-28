import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getOneGroup } from '@/services/useCreateGroup';
import OneGroup from '@/components/OneGroup';

const DetailGroup = () => {
    const router = useRouter();
    const { id } = router.query;

    const [SingleForm, setSingleForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return; // Exit early if id is not available

        const fetchData = async () => {
            try {
                const result = await getOneGroup(id);
                if (result.success) {
                    setSingleForm(result.data);
                    console.log("HEEEEEERRRRRREEEE")
                    console.log(SingleForm.Title);
                } else {
                    setError('Failed to get group data: ' + result.message);
                }
            } catch (error) {
                setError('Error during fetching of group data: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);





    return (
        <OneGroup SingleForm={SingleForm} />
    );
};

export default DetailGroup;