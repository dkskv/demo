export interface IConverter<Source, Destination> {
  toDestination(a: Source): Destination;
  fromDestination(x: Destination): Source;
}
