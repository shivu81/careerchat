import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/sessions";

module {
  public type State = {
    sessions : Map.Map<Types.SessionId, Types.Session>;
    var nextId : Nat;
  };

  public func newState() : State {
    {
      sessions = Map.empty<Types.SessionId, Types.Session>();
      var nextId = 0;
    };
  };

  public func createSession(state : State) : Types.SessionId {
    let id = state.nextId;
    state.nextId += 1;
    let session : Types.Session = {
      id;
      title = "New Session";
      preview = "";
      timestamp = Time.now();
      interests = [];
      skills = [];
      personality = [];
      results = [];
    };
    state.sessions.add(id, session);
    id;
  };

  public func saveSession(state : State, id : Types.SessionId, data : Types.SessionData) : Bool {
    switch (state.sessions.get(id)) {
      case null { false };
      case (?_existing) {
        let updated : Types.Session = {
          id;
          title = data.title;
          preview = data.preview;
          timestamp = data.timestamp;
          interests = data.interests;
          skills = data.skills;
          personality = data.personality;
          results = data.results;
        };
        state.sessions.add(id, updated);
        true;
      };
    };
  };

  public func getSession(state : State, id : Types.SessionId) : ?Types.Session {
    state.sessions.get(id);
  };

  public func listSessions(state : State) : [Types.SessionSummary] {
    let summaries = state.sessions.entries().map(
        func((_id, s)) {
          { id = s.id; title = s.title; preview = s.preview; timestamp = s.timestamp };
        }
      ).toArray();
    summaries.sort(func(a, b) {
      if (a.timestamp > b.timestamp) { #less }
      else if (a.timestamp < b.timestamp) { #greater }
      else { #equal };
    });
  };

  public func deleteSession(state : State, id : Types.SessionId) : Bool {
    switch (state.sessions.get(id)) {
      case null { false };
      case (?_) {
        state.sessions.remove(id);
        true;
      };
    };
  };
};
