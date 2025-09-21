import { Octokit } from "octokit";

export async function fetchGitHubData(accessToken: string, username: string) {
  const octokit = new Octokit({ auth: accessToken });

  try {
    const events = await octokit.request('GET /users/{username}/events', {
      username: username,
      per_page: 100,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return events.data.filter(event => event.type === 'PushEvent' || event.type === 'PullRequestEvent' || event.type === 'IssuesEvent');
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    return [];
  }
}
