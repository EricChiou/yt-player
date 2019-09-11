import { Subject } from 'rxjs';

const subject = new Subject();

export default {
  addVideo: (video) => subject.next({
    video: video,
    action: 'add_video'
  }),
  getSubject: () => subject.asObservable()
};
