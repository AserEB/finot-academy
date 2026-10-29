import CourseDetailsView from './course-details-view'

export const revalidate = 0

export default function CourseDetailsPage({
    params,
}: {
    params: { slug: string }
}) {
    return <CourseDetailsView slug={params.slug} />
}