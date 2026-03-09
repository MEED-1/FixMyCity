import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/common/Navbar';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useAuthStore from '../../store/useAuthStore';
import IssueCard from '../../components/issues/IssueCard';
import { issueService } from '../../services/issueService';
import { lookupService } from '../../services/lookupService';
import CustomDropdown from '../../components/common/CustomDropdown';

const IssuesList = () => {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuthStore();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, open, in_progress, resolved
    const [category, setCategory] = useState('all');
    const [municipality, setMunicipality] = useState('all');
    const [sort, setSort] = useState('latest');

    const [categoriesList, setCategoriesList] = useState([]);
    const [municipalitiesList, setMunicipalitiesList] = useState([]);

    useEffect(() => {
        const fetchLookups = async () => {
            try {
                const [cats, muns] = await Promise.all([
                    lookupService.categories.getAll(),
                    lookupService.municipalities.getAll()
                ]);
                setCategoriesList(cats.map(c => c.name));
                setMunicipalitiesList(muns.map(m => m.name));
            } catch (error) {
                console.error("Failed to fetch filter options", error);
            }
        };
        fetchLookups();
    }, []);

    useEffect(() => {
        fetchIssues();
    }, [filter, category, municipality, sort]);

    const fetchIssues = async () => {
        try {
            setLoading(true);
            const response = await issueService.getAll({
                status: filter === 'all' ? undefined : filter,
                category: category === 'all' ? undefined : category,
                municipality: municipality === 'all' ? undefined : municipality,
                sort: sort
            });
            setIssues(response.data || response || []);
        } catch (error) {
            console.error('Failed to fetch issues:', error);
        } finally {
            setLoading(false);
        }
    };



    const Content = () => (
        <div className={isAuthenticated ? "space-y-8" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"}>
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4 w-full">

                <div className="shrink-0">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {t('issues.browseTitle', 'Browse Urban Issues')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {t('issues.browseSubtitle', 'See what\'s happening in your city')}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto xl:flex-1 xl:justify-end">
                    <CustomDropdown
                        value={filter}
                        onChange={(val) => setFilter(val)}
                        options={[
                            { value: 'all', label: t('dashboard.status.all', 'All Statuses') },
                            { value: 'open', label: t('dashboard.status.open', 'Open') },
                            { value: 'in_progress', label: t('dashboard.status.in_progress', 'In Progress') },
                            { value: 'resolved', label: t('dashboard.status.resolved', 'Resolved') }
                        ]}
                    />

                    <CustomDropdown
                        value={sort}
                        onChange={(val) => setSort(val)}
                        options={[
                            { value: 'latest', label: t('issues.sort.latest', 'Latest First') },
                            { value: 'upvotes', label: t('issues.sort.upvotes', 'Most Upvoted') }
                        ]}
                    />

                    <CustomDropdown
                        value={category}
                        onChange={(val) => setCategory(val)}
                        options={[
                            { value: 'all', label: t('issues.category.all', 'All Categories') },
                            ...categoriesList.map(c => ({ 
                                value: c, 
                                label: t(`reportIssue.categories.${c.toLowerCase().replace(/\s+/g, '_')}`, c) 
                            }))
                        ]}
                    />

                    <CustomDropdown
                        value={municipality}
                        onChange={(val) => setMunicipality(val)}
                        options={[
                            { value: 'all', label: t('issues.municipality.all', 'All Municipalities') },
                            ...municipalitiesList.map(m => ({ value: m, label: m }))
                        ]}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="bg-white dark:bg-surface rounded-xl shadow-sm h-80 animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {issues.length > 0 ? (
                        issues.map((issue) => (
                            <IssueCard key={issue.id} issue={issue} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 text-lg">{t('issues.noIssues', 'No issues found matching your filter.')}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    if (isAuthenticated) {
        return (
            <DashboardLayout>
                <Content />
            </DashboardLayout>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background transition-colors duration-300">
            <Navbar />
            <Content />
        </div>
    );
};

export default IssuesList;
