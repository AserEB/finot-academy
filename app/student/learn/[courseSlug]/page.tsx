import CoursePlayerView from './course-player-view'

export const revalidate = 0

export default function CoursePlayerPage({
    params,
}: {
    params: { courseSlug: string }
}) {
    return <CoursePlayerView courseSlug={params.courseSlug} />
}