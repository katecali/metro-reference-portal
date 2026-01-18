export type CodeEntry = {
  code: string;
  description: string;
  category?: string;
};

export type PenalCodeEntry = {
  title: string;
  code: string;
  description: string;
  class: string;
  time?: string;
  fine?: string;
  extra?: string;
};

export type SpeedLimitEntry = {
  roadType: string;
  limit: string;
  color?: string;
  notes?: string;
};

export const radioCodes: CodeEntry[] = [
  { code: "10-0", description: "Disappeared", category: "General" },
  { code: "10-1", description: "Frequency Change", category: "General" },
  { code: "10-2", description: "Negative", category: "General" },
  { code: "10-3", description: "Stop Transmitting", category: "General" },
  { code: "10-4", description: "Acknowledged", category: "General" },
  { code: "10-5", description: "Relay Message", category: "General" },
  { code: "10-6", description: "Busy", category: "General" },
  { code: "10-7", description: "Out of Service", category: "Status" },
  { code: "10-8", description: "In Service", category: "Status" },
  { code: "10-9", description: "Repeat", category: "General" },
  { code: "10-10", description: "Fight in Progress", category: "Emergency" },
  { code: "10-11", description: "Traffic Stop", category: "Traffic" },
  { code: "10-12", description: "Standby", category: "Status" },
  { code: "10-13", description: "Shots Fired", category: "Emergency" },
  { code: "10-15", description: "Subject in custody en route to Station", category: "Status" },
  { code: "10-16", description: "Stolen Vehicle", category: "Emergency" },
  { code: "10-17", description: "Suspicious Circumstances", category: "General" },
  { code: "10-18", description: "Disturbance", category: "General" },
  { code: "10-19", description: "Return to station", category: "Status" },
  { code: "10-20", description: "Location", category: "General" },
  { code: "10-21", description: "Call by phone", category: "General" },
  { code: "10-22", description: "Disregard", category: "General" },
  { code: "10-23", description: "Arrived on Scene", category: "Status" },
  { code: "10-25", description: "Contact With ?", category: "General" },
  { code: "10-26", description: "ETA", category: "General" },
  { code: "10-27", description: "DL Check", category: "Traffic" },
  { code: "10-28", description: "Plate Check", category: "Traffic" },
  { code: "10-29", description: "Warrant Check", category: "General" },
  { code: "10-30", description: "Wanted Person", category: "General" },
  { code: "10-31", description: "Armed Person", category: "Emergency" },
  { code: "10-32", description: "Additional Unit Req", category: "Emergency" },
  { code: "10-34", description: "Completed - No Report", category: "Status" },
  { code: "10-35", description: "No Warrants", category: "General" },
  { code: "10-36", description: "Situation Under Control", category: "Status" },
  { code: "10-41", description: "Beginning Tour", category: "Status" },
  { code: "10-42", description: "Ending Tour", category: "Status" },
  { code: "10-50", description: "Accident", category: "Traffic" },
  { code: "10-52", description: "EMS Requested", category: "Medical" },
  { code: "10-70", description: "Foot Pursuit", category: "Emergency" },
  { code: "10-80", description: "Vehicle Pursuit", category: "Emergency" },
  { code: "10-99", description: "Officer In Distress", category: "Emergency" },
];

export const natoAlphabet = [
  { letter: "A", phonetic: "Alpha" },
  { letter: "B", phonetic: "Bravo" },
  { letter: "C", phonetic: "Charlie" },
  { letter: "D", phonetic: "Delta" },
  { letter: "E", phonetic: "Echo" },
  { letter: "F", phonetic: "Foxtrot" },
  { letter: "G", phonetic: "Golf" },
  { letter: "H", phonetic: "Hotel" },
  { letter: "I", phonetic: "India" },
  { letter: "J", phonetic: "Juliet" },
  { letter: "K", phonetic: "Kilo" },
  { letter: "L", phonetic: "Lima" },
  { letter: "M", phonetic: "Mike" },
  { letter: "N", phonetic: "November" },
  { letter: "O", phonetic: "Oscar" },
  { letter: "P", phonetic: "Papa" },
  { letter: "Q", phonetic: "Quebec" },
  { letter: "R", phonetic: "Romeo" },
  { letter: "S", phonetic: "Sierra" },
  { letter: "T", phonetic: "Tango" },
  { letter: "U", phonetic: "Uniform" },
  { letter: "V", phonetic: "Victor" },
  { letter: "W", phonetic: "Whiskey" },
  { letter: "X", phonetic: "X-ray" },
  { letter: "Y", phonetic: "Yankee" },
  { letter: "Z", phonetic: "Zulu" },
];

export const localPenalCodes: PenalCodeEntry[] = [
  { code: "PC 31", title: "Aid & abet", time: "120s", fine: "$8,000 - $15,000", class: "All Concerned", description: "Involvement in commission of a crime.", extra: "All persons concerned in commission." },
  { code: "PC 32", title: "Accessory", time: "60s", fine: "$3,000", class: "Misdemeanor", description: "Harboring/concealing a person to protect from arrest.", extra: "Accessory after the fact." },
  { code: "PC 67", title: "Bribery of peace officer", time: "60s", fine: "$1,000", class: "Misdemeanor", description: "Attempting to bribe an officer.", extra: "Seize Cash" },
  { code: "PC 69", title: "Threaten peace officer", time: "60s", fine: "$1,200", class: "Misdemeanor", description: "Threatening a government official." },
  { code: "PC 148(a)", title: "Resisting/Obstructing", time: "90s", fine: "$1,500", class: "Both", description: "Resisting or delaying a peace officer." },
  { code: "PC 148.5", title: "Falsely reporting crime", time: "30s", fine: "$600", class: "Misdemeanor", description: "Reporting a crime that did not occur." },
  { code: "PC 148.9", title: "Providing false ID", time: "30s", fine: "$1,000", class: "Misdemeanor", description: "Giving false identity to an officer." },
  { code: "PC 187", title: "Murder", time: "300s", fine: "$20,000", class: "Felony", description: "Wilful killing of another.", extra: "Seize Cash" },
  { code: "PC 192", title: "Manslaughter", time: "180s", fine: "$10,000", class: "Felony", description: "Illegal killing without malice." },
  { code: "PC 207", title: "Kidnapping", time: "120s", fine: "$12,000", class: "Felony", description: "Abduction of another person.", extra: "Seize Cash" },
  { code: "PC 211(a)", title: "Robbery (<= $15k)", time: "90s", fine: "$7,000", class: "Felony", description: "Theft using force.", extra: "Seize Cash" },
  { code: "PC 211(b)", title: "Robbery (> $15k / BANK)", time: "180s", fine: "$50,000", class: "Felony", description: "Bank robbery or high value theft.", extra: "Seize Cash" },
  { code: "PC 215", title: "Car Jacking", time: "120s", fine: "$10,000", class: "Felony", description: "Theft of a vehicle by force.", extra: "Seize Cash" },
  { code: "PC 236", title: "False Imprisonment", time: "60s", fine: "$6,000", class: "Both", description: "Direct restraint of liberty." },
  { code: "PC 240", title: "Assault", time: "60s", fine: "$3,000", class: "Misdemeanor", description: "Threat or attempt of bodily harm." },
  { code: "PC 242", title: "Battery", time: "90s", fine: "$5,000", class: "Misdemeanor", description: "Offensive touching/force." },
  { code: "PC 243(e)(1)", title: "Domestic Violence (Misd)", time: "90s", fine: "$5,000", class: "Misdemeanor", description: "Violence within home environment." },
  { code: "PC 245", title: "Assault w/ Deadly Weapon", time: "150s", fine: "$14,000", class: "Felony", description: "Assault with lethal instrument." },
  { code: "PC 246.3", title: "Negligent Discharge", time: "100s", fine: "$4,000", class: "Both", description: "Unlawful discharge of firearm." },
  { code: "PC 314", title: "Indecent exposure", time: "30s", fine: "$1,500", class: "Misdemeanor", description: "Exposing self in public." },
  { code: "PC 415", title: "Disturbing the peace", time: "30s", fine: "$2,000", class: "Misdemeanor", description: "Loud/offensive conduct." },
  { code: "PC 417", title: "Brandishing firearm", time: "60s", fine: "$5,000", class: "Both", description: "Exhibiting weapon threateningly." },
  { code: "PC 422", title: "Criminal threats", time: "60s", fine: "$6,000", class: "Misdemeanor", description: "Threats of death/great injury." },
  { code: "PC 451", title: "Arson", time: "60s", fine: "$3,000 - $10,000", class: "Felony", description: "Wilful burning of property." },
  { code: "PC 496", title: "Receiving stolen property", time: "60s", fine: "$3,000", class: "Felony", description: "Possessing property known to be stolen." },
  { code: "PC 518", title: "Extortion", time: "90s", fine: "$5,000", class: "Misdemeanor", description: "Threats for gain.", extra: "Seize Cash" },
  { code: "PC 552", title: "General loitering", time: "0s", fine: "$1,000", class: "Misdemeanor", description: "Lingering without purpose." },
  { code: "PC 555", title: "Gov Property Loitering", time: "0s", fine: "$1,000", class: "Misdemeanor", description: "Loitering on government grounds." },
  { code: "PC 594", title: "Vandalism", time: "30s", fine: "$1,500 - $5,000", class: "Misdemeanor", description: "Defacing property." },
  { code: "PC 597", title: "Animal Abuse", time: "60s", fine: "$3,000", class: "Misdemeanor", description: "Cruelty to animals." },
  { code: "PC 602", title: "Trespassing", time: "30s", fine: "$1,500", class: "Misdemeanor", description: "Entering property without permission." },
  { code: "PC 647(f)", title: "Public Intoxication", time: "0s", fine: "$1,000", class: "Misdemeanor", description: "Unable to care for self due to drugs/alc.", extra: "EMS required for rehab" },
  { code: "PC 653", title: "Prostitution", time: "30s", fine: "$4,000", class: "Misdemeanor", description: "Engaging in sexual acts for hire.", extra: "EMS checkup required" },
  { code: "PC 16590", title: "Prohibited weapon", time: "60s", fine: "$5,000", class: "Felony", description: "Possession of banned weapons." },
  { code: "PC 25850(a)", title: "Public Firearm Carry", time: "30s", fine: "$1,000", class: "Misdemeanor", description: "Carrying firearm in public place." },
  { code: "VC 2800.1", title: "Evading (Not dangerous)", time: "90s", fine: "$5,000", class: "Felony", description: "Fleeing from officers." },
  { code: "VC 2800.2", title: "Evading (Dangerous)", time: "150s", fine: "$8,000", class: "Felony", description: "Dangerous fleeing, no injuries." },
  { code: "VC 2800.3", title: "Evading (Injury/Death)", time: "240s", fine: "$15,000", class: "Felony", description: "Dangerous fleeing causing injury/death." },
  { code: "VC 10851", title: "Vehicle Theft", time: "60s", fine: "$5,000", class: "Felony", description: "Stealing a vehicle.", extra: "Seize Cash" },
  { code: "VC 12500(a)", title: "Unlicensed Driving", time: "60s", fine: "$1,500 - $3,500", class: "Misdemeanor", description: "Driving without valid license.", extra: "Seize Vehicle" },
  { code: "VC 14601", title: "Suspended License", time: "60s", fine: "$10,000", class: "Misdemeanor", description: "Driving on suspended/revoked license.", extra: "Seize Vehicle" },
  { code: "VC 16028(a)", title: "No Insurance", time: "60s", fine: "$1,500 - $3,500", class: "Misdemeanor", description: "Failure to provide proof of insurance.", extra: "Seize Vehicle" },
  { code: "VC 20001", title: "Felony Hit & Run", time: "180s", fine: "$12,000", class: "Felony", description: "Leaving scene of injury accident.", extra: "Seize Vehicle" },
  { code: "VC 20002", title: "Misd Hit & Run", time: "90s", fine: "$5,000", class: "Misdemeanor", description: "Leaving scene of property accident.", extra: "Seize Vehicle" },
  { code: "VC 21453", title: "Red Light Violation", time: "0s", fine: "$1,000", class: "Misdemeanor", description: "Failure to stop at red signal." },
  { code: "VC 23103(b)", title: "Reckless Driving (Life)", time: "30s", fine: "$2,500", class: "Felony", description: "Endangering life via driving." },
  { code: "VC 23153", title: "DUI", time: "120s", fine: "$3,000", class: "Misdemeanor", description: "Driving under influence." },
  { code: "HS 11350", title: "Cannabis (7-14 buds)", time: "60s", fine: "$100 per bud over", class: "Misdemeanor", description: "Possession of excess cannabis.", extra: "Seize Contraband & Cash" },
  { code: "HS 11351(a)", title: "Intent to Supply (4+ Hash)", time: "90s", fine: "$200 per hash", class: "Misdemeanor", description: "Possession for sale.", extra: "Seize Contraband & Cash" },
  { code: "HS 11351(b)", title: "Intent to Supply (4+ Meth)", time: "300s", fine: "$500 per wrap", class: "Misdemeanor", description: "Possession for sale.", extra: "Seize Contraband & Cash" },
  { code: "HS 11377", title: "Meth Possession", time: "60s", fine: "$500 per wrap", class: "Misdemeanor", description: "Illegal possession of meth.", extra: "Seize Contraband" },
  { code: "HS 11392(b)", title: "Intent to Manufacture", time: "180s", fine: "$1,000 per chem", class: "Misdemeanor", description: "Drug manufacturing intent.", extra: "Seize Contraband & Cash" },
];

export const federalPenalCodes: PenalCodeEntry[] = [
  { code: "FED-01", title: "FEDERAL TRESPASS", fine: "$100,000.00", time: "15m", class: "FEDERAL FELONY", description: "Unauthorized entry into federal government facilities." },
  { code: "FED-02", title: "ESPIONAGE", fine: "$500,000.00", time: "30m", class: "FEDERAL FELONY", description: "Theft of classified government information." },
];

export const speedLimits: SpeedLimitEntry[] = [
  { roadType: "Highways / Freeways", limit: "75 MPH", color: "Red" },
  { roadType: "State Routes", limit: "55 MPH", color: "Blue" },
  { roadType: "Business Districts", limit: "45 MPH", color: "Standard" },
  { roadType: "Residential Areas", limit: "25 MPH", color: "Standard" },
  { roadType: "School Zones", limit: "25 MPH", color: "Standard" },
];
