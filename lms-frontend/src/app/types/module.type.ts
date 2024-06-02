import { Lesson } from "./lesson.type"

export type Module={
    name:string,
    description:string,
    lessons?:Lesson[]|[]
}