import Link from "next/link";
import { formatPlayingAge, type TalentProfile } from "@/lib/data";
import { Photo } from "./Photo";

export function ProfileCard({ p }: { p: TalentProfile }) {
  return (
    <Link href={`/profile/${p.profileUrl}`} className="talent-card">
      <span className="talent-card__photo"><Photo src={p.media.headshots[0]} alt="" label={p.fullName} sizes="(max-width: 640px) 50vw, 240px" /></span>
      <span className="talent-card__name">{p.fullName}</span>
      <span className="talent-card__meta">{p.category} · {formatPlayingAge(p.personalData.playingAge)}</span>
    </Link>
  );
}
