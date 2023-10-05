import axios from 'axios';
const apiUrl = process.env.API_URL || "https://api.thegraph.com/subgraphs/name/stakehouse-dev/lsd"
export async function fetchSyndicateData() {
  const query = `
    query {
      syndicates {
        liquidStakingNetwork {
          firstKnot
          id
          isNodeRunningBehindGatekeeper
          numberOfStakedValidators
          numberOfValidatorsBeingPrepared
          optionalGatekeeper
          savETHPool
          stakehouseAddress
          ticker
          numberOfKnotsThatHaveRageQuitted
          lsdIndex
          liquidStakingManager
          numberOfKnotsThatHaveMintedDerivatives
          feesAndMevPool
          feeRecipientAndSyndicate
          dao
          commission
        }
        totalPayout
        totalNodeOperatorPayout
        totalFeesAndMevPayout
        payouts(orderBy: timestamp, orderDirection: asc) {
          recipient
          type
          user
          timestamp
          id
          blsPublicKey
          amount
        }
      }
    }
  `;

  const queryGraph = async (query: string, apiUrl: string) => {
    try {
      const response = await axios.post(apiUrl, { query }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };
  
  return await queryGraph(query, apiUrl);
}
