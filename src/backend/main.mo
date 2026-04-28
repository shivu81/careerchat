import Map "mo:core/Map";
import SessionsLib "lib/sessions";
import SessionsMixin "mixins/sessions-api";
import SessionTypes "types/sessions";

actor {
  let sessionsState : SessionsLib.State = {
    sessions = Map.empty<SessionTypes.SessionId, SessionTypes.Session>();
    var nextId = 0;
  };

  include SessionsMixin(sessionsState);
};
