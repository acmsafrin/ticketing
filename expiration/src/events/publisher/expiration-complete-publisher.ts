import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from '@acmticket/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
