const API_URL = "https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql";

export const GET_FULL_PROFILE = `
query GetFullProfile {
  user {
    login
    firstName
    lastName
    auditRatio
    totalUp
    totalDown
    attrs
    events(where: {cohorts: {labelName: {_is_null: false}}}) {
      cohorts {
        labelName
      }
    }
    
    audits_aggregate(where: {grade: {_is_null: false}}) {
      aggregate {
        count
      }
    }
   
  }
  
  xp: transaction_aggregate(where: { type: { _eq: "xp" }, event: { object: { name: { _eq: "Module" } } } }) {
    aggregate { 
      sum { 
        amount 
      } 
    }
  }
  
  level: transaction_aggregate(where: { type: { _eq: "level" }, event: { object: { name: { _eq: "Module" } } } }) {
    aggregate { 
      max { 
        amount 
      } 
    }
  }
  
  projects: transaction(
    where: {type: {_eq: "xp"}, eventId: {_eq: 41}}
    order_by: {createdAt: desc}
  ) {
    amount
    createdAt
    object {
      name
      progresses {
        group {
          members(where: {accepted: {_eq: true}}) {
            userLogin
          }
        }
      }
    }
  }
  
  skills: transaction(where: { type: { _regex: "skill_" } }) {
    amount
    type
  }
}
`;
export async function fetchAllData() {
  const token = localStorage.getItem("jwt");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: GET_FULL_PROFILE }),
  });

  const result = await res.json();

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data;
}
