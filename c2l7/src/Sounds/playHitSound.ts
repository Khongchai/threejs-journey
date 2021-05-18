import { Body } from "cannon-es";

type collide = {
  type: "collide";
  body: Body;
  contact: any;
  target: Body;
};
const hitSound = new Audio("hit.mp3");

export const playHitSound = (collision: collide) => {
  const currentImpact = collision.contact.getImpactVelocityAlongNormal();
  const currentVolume = velocityToVolume(currentImpact);
  hitSound.volume = currentVolume;
  hitSound.currentTime = 0;
  hitSound.play();
};

const maxVelocity = 8;
const minVelocity = 0.06;
const taperPower = 1.5;
function velocityToVolume(impact: number) {
  if (impact > maxVelocity) return 1;
  if (impact < minVelocity) return 0;
  const volumeFromVelocity = impact ** taperPower / maxVelocity ** taperPower;
  return volumeFromVelocity;
}
