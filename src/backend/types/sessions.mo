module {
  public type SessionId = Nat;

  public type SkillRating = {
    name : Text;
    rating : Nat;
  };

  public type PersonalityAnswer = {
    axis : Text;
    value : Text;
  };

  public type CareerResult = {
    careerName : Text;
    score : Nat;
    explanation : Text;
    improvements : [Text];
    futureScope : Text;
  };

  public type SessionData = {
    title : Text;
    preview : Text;
    timestamp : Int;
    interests : [Text];
    skills : [SkillRating];
    personality : [PersonalityAnswer];
    results : [CareerResult];
  };

  public type Session = {
    id : SessionId;
    title : Text;
    preview : Text;
    timestamp : Int;
    interests : [Text];
    skills : [SkillRating];
    personality : [PersonalityAnswer];
    results : [CareerResult];
  };

  public type SessionSummary = {
    id : SessionId;
    title : Text;
    preview : Text;
    timestamp : Int;
  };
};
