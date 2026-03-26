import Int "mo:core/Int";
import Time "mo:core/Time";
import List "mo:core/List";
import Order "mo:core/Order";

actor {
  type Inquiry = {
    name : Text;
    phone : Text;
    location : Text;
    serviceRequired : Text;
    timestamp : Time.Time;
  };

  module Inquiry {
    public func compare(inquiry1 : Inquiry, inquiry2 : Inquiry) : Order.Order {
      Int.compare(inquiry2.timestamp, inquiry1.timestamp);
    };
  };

  let inquiries = List.empty<Inquiry>();

  public shared ({ caller }) func submitInquiry(name : Text, phone : Text, location : Text, serviceRequired : Text) : async () {
    let inquiry : Inquiry = {
      name;
      phone;
      location;
      serviceRequired;
      timestamp = Time.now();
    };
    inquiries.add(inquiry);
  };

  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    inquiries.toArray().sort();
  };
};
