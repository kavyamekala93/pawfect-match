import React from "react";
import {MatchPerfectDog} from "../components/MatchPerfectDog";

// Fetching search params on the server side and passing to client component
const MatchPage = ({ searchParams }) => {
  const matchId = searchParams?.matchId;

  if (!matchId) {
    return <div>No match found</div>;
  }

  return <MatchPerfectDog matchId={matchId} />;
};

export default MatchPage;