import React from 'react';
import ProjectCard from './ProjectCard';

interface Project {
  id: string | number;
  name: string;
  repo: string;
  status: string;
}

interface ProjectListProps {
  projects: Project[];
  onView: (id: string | number) => void;
  onEdit: (id: string | number) => void;
  onDelete: (id: string | number) => void;
  onApprove: (id: string | number) => void;
}

export default function ProjectList({ projects, onView, onEdit, onDelete, onApprove }: ProjectListProps) {
  return (
    <div>
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          id={project.id}
          name={project.name}
          repo={project.repo}
          status={project.status}
          onView={() => onView(project.id)}
          onEdit={() => onEdit(project.id)}
          onDelete={() => onDelete(project.id)}
          onApprove={() => onApprove(project.id)}
        />
      ))}
    </div>
  );
}
