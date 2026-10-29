import React from 'react';
import { CheckCircle2, Clock, AlertCircle, BarChart3, Folder, Flame, TrendingUp } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function StatsSummary() {
  const { stats, tasks } = useTasks();

  if (!stats) {
    return (
      <div className="py-12 text-center text-xs text-zinc-400">
        Loading productivity analytics...
      </div>
    );
  }

  const {
    total = 0,
    completed = 0,
    inProgress = 0,
    overdue = 0,
    completionRate = 0,
    byStatus = {},
    byPriority = {},
    byProject = [],
  } = stats;

  const urgentAndHigh = (byPriority.urgent || 0) + (byPriority.high || 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Completed */}
        <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-subtle">
          <div className="flex items-center justify-between text-zinc-500 text-xs mb-2">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {completed}
            <span className="text-xs font-normal text-zinc-400 ml-1">/ {total}</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            {completionRate}% overall completion
          </div>
        </div>

        {/* Card 2: In Progress */}
        <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-subtle">
          <div className="flex items-center justify-between text-zinc-500 text-xs mb-2">
            <span>In Flight</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {inProgress}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Actively being worked on
          </div>
        </div>

        {/* Card 3: Overdue */}
        <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-subtle">
          <div className="flex items-center justify-between text-zinc-500 text-xs mb-2">
            <span>Overdue</span>
            <AlertCircle className={`w-4 h-4 ${overdue > 0 ? 'text-rose-500' : 'text-zinc-400'}`} />
          </div>
          <div className={`text-2xl font-bold ${overdue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
            {overdue}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            {overdue > 0 ? 'Needs immediate triage' : 'No overdue tasks'}
          </div>
        </div>

        {/* Card 4: Urgent & High */}
        <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-subtle">
          <div className="flex items-center justify-between text-zinc-500 text-xs mb-2">
            <span>High Priority</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {urgentAndHigh}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Urgent or High focus
          </div>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Tasks by Priority
            </h3>
            <BarChart3 className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="space-y-3">
            {[
              { label: 'Urgent', count: byPriority.urgent || 0, color: 'bg-rose-500' },
              { label: 'High', count: byPriority.high || 0, color: 'bg-amber-500' },
              { label: 'Medium', count: byPriority.medium || 0, color: 'bg-blue-500' },
              { label: 'Low', count: byPriority.low || 0, color: 'bg-zinc-400' },
            ].map((p) => {
              const pct = total > 0 ? Math.round((p.count / total) * 100) : 0;
              return (
                <div key={p.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{p.label}</span>
                    <span className="text-zinc-400 font-mono">
                      {p.count} <span className="text-[11px]">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${p.color} rounded-full transition-all duration-300`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workspace / Project Distribution */}
        <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Tasks by Workspace
            </h3>
            <Folder className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="space-y-3">
            {byProject.length === 0 ? (
              <div className="text-xs text-zinc-400">No projects yet</div>
            ) : (
              byProject.map((proj) => {
                const pct = total > 0 ? Math.round((proj.count / total) * 100) : 0;
                return (
                  <div key={proj.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">{proj.name}</span>
                      <span className="text-zinc-400 font-mono">
                        {proj.count} <span className="text-[11px]">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-600 dark:bg-zinc-400 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-subtle space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
          Recent Activity Timeline
        </h3>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
          {tasks
            .flatMap((t) =>
              (t.activityLog || []).map((log) => ({
                ...log,
                taskTitle: t.title,
                taskId: t._id || t.id,
              }))
            )
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 8)
            .map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                    {item.action}
                  </span>
                  <span className="text-zinc-400">on</span>
                  <span className="text-zinc-500 dark:text-zinc-400 truncate max-w-xs italic">
                    "{item.taskTitle}"
                  </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 shrink-0">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

