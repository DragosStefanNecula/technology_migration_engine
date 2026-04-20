const TYPE_TITLES = {
    feat: "Feature",
    fix: "Bug Fix",
    perf: "Performance",
    refactor: "Refactor",
    revert: "Revert",
    docs: "Docs",
    style: "Style",
    test: "Test",
    build: "Build",
    ci: "CI",
    chore: "Chore",
};

function getIsoWeekKey(dateInput) {
    const date = new Date(dateInput);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    const utcDate = new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    );
    const isoDay = utcDate.getUTCDay() || 7;

    utcDate.setUTCDate(utcDate.getUTCDate() + 4 - isoDay);

    const isoYear = utcDate.getUTCFullYear();
    const yearStart = new Date(Date.UTC(isoYear, 0, 1));
    const weekNumber = Math.ceil(
        ((utcDate - yearStart) / 86400000 + 1) / 7
    );

    return `${isoYear}-W${String(weekNumber).padStart(2, "0")}`;
}

function getTypeTitle(type) {
    if (!type) {
        return "Other";
    }

    return TYPE_TITLES[type] || `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
}

module.exports = {
    writerOpts: {
        generateOn: null,
        groupBy: "weekTitle",
        commitGroupsSort: (a, b) => b.title.localeCompare(a.title),
        commitsSort: ["typeTitle", "scope", "subject"],
        transform: (commit) => {
            const fullHash = commit.hash;
            const weekKey = getIsoWeekKey(commit.committerDate || commit.authorDate);
            const subject = commit.subject || commit.header || "No commit subject";

            return {
                hash: typeof fullHash === "string" ? fullHash.slice(0, 7) : fullHash,
                subject,
                typeTitle: getTypeTitle(commit.type),
                weekTitle: weekKey ? `Week ${weekKey}` : "Week Unknown",
            };
        },
        mainTemplate: `{{#each commitGroups}}
## {{title}}

{{#each commits}}
- **{{typeTitle}}**{{#if scope}} **{{scope}}:**{{/if}} {{subject}}{{#if @root.repoUrl}} ([{{hash}}]({{@root.repoUrl}}/commit/{{raw.hash}})){{else}}{{#if raw.hash}} ({{hash}}){{/if}}{{/if}}
{{/each}}

{{/each}}{{#if noteGroups}}
{{#each noteGroups}}
### {{title}}

{{#each notes}}
- {{text}}
{{/each}}

{{/each}}{{/if}}`,
    },
};
