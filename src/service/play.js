import { Subject } from 'rxjs';

const subject = new Subject();

export default {
  playVideo: (video) => subject.next({
    video: video,
    action: 'play_video'
  }),
  playNext: () => subject.next({
    action: 'play_next'
  }),
  getSubject: () => subject.asObservable()
};
