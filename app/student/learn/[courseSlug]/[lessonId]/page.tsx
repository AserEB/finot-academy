import LessonDetailView from './lesson-detail-view'

export const revalidate = 0

export default function LessonDetailPage({
    params,
}: {
    params: { courseSlug: string; lessonId: string }
}) {
    return (
        <LessonDetailView
            courseSlug={params.courseSlug}
            lessonId={params.lessonId}
        />
    )
}