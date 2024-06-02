export type Lesson={
    name:string,
    description:string,
    content:{
        contentType:"video"|"text",
        contentData:string
    },
    length: {
        hour:number,
        minutes:number
    }
}