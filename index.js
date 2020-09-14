const core = require('@actions/core');
const github = require('@actions/github');


const checkBranch = async function() {
  const repository = core.getInput('repository')
  const [owner = null, repo = null] = repository.split('/')
  const branch= core.getInput('branch')
  const token = core.getInput('token') || ''

  core.debug(`Checking branch ${owner}/${repo}#${branch}`)

  if (owner === null || repo === null) {
    throw new Error(
      'Failed to parse input "repository". Must be on format: owner/repo'
    )
  }

  try {
    const gh = new github.GitHub(token)
    const branchInfo = await gh.repos.getBranch({
      repo,
      branch,
      owner
    })
    core.debug(`Found branch ${branchInfo}`)
    core.setOutput('exists', 'true')
    return
  } catch (e) {
    if (e.message === 'Branch not found') {
      core.setOutput('exists', 'false')
      return
    }
    throw new Error(`Failed to get branch: ${e.message}, for repo: ${repo}, branch: ${branch}, owner: ${owner}`)
  }
}

checkBranch();
