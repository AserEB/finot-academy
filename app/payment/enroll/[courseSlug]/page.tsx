import EnrollmentFormView from './enrollment-form-view'

export const revalidate = 0

export default function EnrollPage({
    params,
}: {
    params: { courseSlug: string }
}) {
    return <EnrollmentFormView courseSlug={params.courseSlug} />
}