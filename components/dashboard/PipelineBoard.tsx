"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  PIPELINE_STAGES,
  type Lead,
  type PipelineStage,
} from "@/lib/mock/data";
import { scoreClass } from "@/lib/format";

/** Görev 4 — sürükle-bırak kanban (dnd-kit). */
export function PipelineBoard({ leads }: { leads: Lead[] }) {
  const t = useTranslations("Pipeline");
  const tc = useTranslations("Channels");

  // Lead-id → vaihe. Paikallinen tila, nollautuu sivun latauksella.
  const [placement, setPlacement] = useState<Record<string, PipelineStage>>(
    () => Object.fromEntries(leads.map((l) => [l.id, l.pipelineAsamasi])),
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const stageLabel = (s: PipelineStage) =>
    t(
      `stage${s.charAt(0).toUpperCase()}${s.slice(1)}` as
        | "stageUusi"
        | "stageArviointi"
        | "stageKuuma"
        | "stageHoivaus"
        | "stageAjanvaraus",
    );

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const leadId = String(e.active.id);
    const target = e.over?.id as PipelineStage | undefined;
    if (target && PIPELINE_STAGES.includes(target)) {
      setPlacement((p) => ({ ...p, [leadId]: target }));
    }
  }

  const activeLead = leads.find((l) => l.id === activeId) ?? null;

  return (
    <DndContext
      id="pipeline-board"
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="kanban">
        {PIPELINE_STAGES.map((stage) => {
          const items = leads.filter((l) => placement[l.id] === stage);
          return (
            <Column key={stage} stage={stage} title={stageLabel(stage)} count={items.length}>
              {items.map((l) => (
                <Card
                  key={l.id}
                  lead={l}
                  scoreWord={t("score")}
                  sourceLabel={tc(l.kaynakKanal)}
                />
              ))}
            </Column>
          );
        })}
      </div>

      <DragOverlay>
        {activeLead ? (
          <div className="kanban-card" style={{ boxShadow: "0 6px 18px rgba(0,0,0,.15)" }}>
            <div className="kanban-card__name">{activeLead.isim}</div>
            <div className="kanban-card__svc">{activeLead.palvelu}</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function Column({
  stage,
  title,
  count,
  children,
}: {
  stage: PipelineStage;
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  return (
    <div ref={setNodeRef} className={`kanban-col${isOver ? " kanban-col--over" : ""}`}>
      <div className="kanban-col__head">
        <span>{title}</span>
        <span className="kanban-col__count">{count}</span>
      </div>
      {children}
    </div>
  );
}

function Card({
  lead,
  scoreWord,
  sourceLabel,
}: {
  lead: Lead;
  scoreWord: string;
  sourceLabel: string;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: lead.id,
  });
  return (
    <div
      ref={setNodeRef}
      className="kanban-card"
      style={{ opacity: isDragging ? 0.35 : 1 }}
      {...listeners}
      {...attributes}
    >
      <div className="kanban-card__name">{lead.isim}</div>
      <div className="kanban-card__svc">{lead.palvelu}</div>
      <div className="kanban-card__foot">
        <span className={scoreClass(lead.leadSkoru)}>
          {lead.leadSkoru} {scoreWord}
        </span>
        <span className="pill">{sourceLabel}</span>
      </div>
    </div>
  );
}
