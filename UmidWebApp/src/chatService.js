import { Subject } from 'rxjs';

const subject = new Subject();

const listSubject = new Subject();

const nameSearch = new Subject();

export const chatService = {
   
    sendMessage: message => subject.next({ text: message }),
    //     clearMessages: () => subject.next(),
    getMessage: () =>  subject.asObservable(),


    setList: values => listSubject.next(values),
    getList: () => listSubject.asObservable(),

    setName: values => nameSearch.next(values),
    getName: () => nameSearch.asObservable()

}