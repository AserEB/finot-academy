import ManageCertificatesView from './manage-certificates-view'

export const metadata = {
    title: 'Manage Certificates | Finot Admin',
    description: 'Review and grant student certificate requests.',
}

export default function AdminCertificatesPage() {
    return <ManageCertificatesView />
}