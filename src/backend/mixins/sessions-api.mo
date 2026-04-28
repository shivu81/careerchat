import SessionsLib "../lib/sessions";
import Types "../types/sessions";

mixin (state : SessionsLib.State) {

  public func createSession() : async Types.SessionId {
    SessionsLib.createSession(state);
  };

  public func saveSession(id : Types.SessionId, data : Types.SessionData) : async Bool {
    SessionsLib.saveSession(state, id, data);
  };

  public query func getSession(id : Types.SessionId) : async ?Types.Session {
    SessionsLib.getSession(state, id);
  };

  public query func listSessions() : async [Types.SessionSummary] {
    SessionsLib.listSessions(state);
  };

  public func deleteSession(id : Types.SessionId) : async Bool {
    SessionsLib.deleteSession(state, id);
  };
};
