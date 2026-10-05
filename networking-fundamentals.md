# Networking: Simple Definitions & Fundamentals

© MOUTASEM-AWAD

A short guide to common networking concepts and interview comparisons, selected from the supplied I2208 and I3304 notes. These are simplified explanations, not a slide-by-slide summary.

## Basics

### Network

Devices connected so they can exchange data and share resources.

Remember: Two computers sharing a printer are using a network.

### Protocol

Rules that devices follow to communicate.

Remember: HTTP defines how a browser and web server exchange messages.

### LAN and WAN

A LAN connects devices in a small area, such as an office. A WAN connects networks over a larger area.

Remember: Remember: local area versus wide area.

### Bandwidth and latency

Bandwidth describes a link’s capacity. Latency is the time data takes to travel.

Remember: A link can have high capacity but still have a long delay.

## Devices

### Repeater

Regenerates a signal so it can travel farther. It works at the physical layer.

Remember: It does not choose a route or inspect IP addresses.

### Hub

A multiport repeater. It repeats incoming signals to the other ports.

Remember: It does not learn which device is connected to which port.

### Switch

A basic Ethernet switch connects devices in a LAN and forwards frames using MAC addresses. It works at Layer 2.

Remember: It learns source MAC addresses. Unknown destinations and broadcasts are flooded to other ports in the same broadcast domain.

### Router

Connects different IP networks and forwards packets using a routing table. It works at Layer 3.

Remember: Your computer sends traffic for another network to its default gateway, usually a router.

## Models

### OSI model

A seven-layer model that organizes networking jobs.

Remember: Bottom to top: Physical, Data Link, Network, Transport, Session, Presentation, Application.

### OSI layers in plain English

Physical: signals and bits. Data Link: frames on a link. Network: IP addressing and routing. Transport: communication between applications. Session: managing conversations. Presentation: data format, encryption and compression. Application: network services for applications.

Remember: Remember common examples: repeater L1, basic switch L2, router L3, TCP/UDP L4.

### TCP/IP model

The protocol family used by the Internet. These notes use five layers: Physical, Data Link, Network, Transport and Application.

Remember: Some descriptions combine the bottom two into a four-layer model; keep the course’s five-layer view for revision.

### Encapsulation

Each layer adds information needed to deliver the data. The receiver removes it in reverse order.

Remember: Think: application data → TCP segment → IP packet → Ethernet frame → bits. UDP uses datagrams.

## Addressing

### MAC address

A link-layer address used to deliver Ethernet frames on a LAN. Ethernet MAC addresses are 48 bits long.

Remember: A switch uses MAC addresses when forwarding frames.

### IP address

A logical address used to identify an interface and route packets between networks. IPv4 is 32 bits; IPv6 is 128 bits.

Remember: MAC helps delivery on a link; IP helps delivery across networks.

### Subnet and subnet mask

A subnet is a portion of an IP network. A mask or prefix length identifies the network part of an address.

Remember: 192.168.1.10/24 belongs to network 192.168.1.0/24. The /24 means 24 network bits.

### Default gateway

The next-hop router a device uses when no more specific route matches the destination.

Remember: Traffic to a different network usually goes to the gateway.

### ARP

Finds the MAC address associated with an IPv4 address on the local link.

Remember: For a remote destination, your computer finds the gateway’s MAC address, not the remote server’s MAC address.

### NAT

Changes IP addresses as packets pass through a router. Port translation can let many private devices share one public IPv4 address.

Remember: NAT translation and firewall filtering are different jobs.

## Delivery

### Routing and forwarding

Routing determines paths and builds routing information. Forwarding moves a packet to the chosen outgoing interface.

Remember: Static routes are entered manually; dynamic routing protocols exchange routing information.

### TCP

Provides reliable, ordered delivery of a byte stream using acknowledgments and retransmissions.

Remember: Connection setup uses SYN → SYN-ACK → ACK.

### UDP

Sends datagrams without built-in reliable delivery or ordering. It has no TCP-style connection setup.

Remember: It has less transport overhead; the application decides how to handle loss.

### Port number

Identifies a service or application endpoint at the transport layer.

Remember: IP identifies the host interface; a port helps identify the application. Common examples: HTTP 80, DNS 53.

### Flow control and congestion control

Flow control protects a receiver from too much incoming data. Congestion control reduces pressure on the network.

Remember: Receiver capacity and network capacity are different limits.

## Services

### DNS

A naming service that maps names to records, including IP addresses.

Remember: It helps your browser find the address for a website name. DNS is not the service that assigns your computer its address.

### DHCP

Automatically provides network settings, including an IP address, subnet mask and gateway.

Remember: IPv4’s usual exchange: Discover → Offer → Request → Acknowledge (DORA).

### HTTP

An application protocol for requests and responses between web clients and servers.

Remember: A browser requests a page; the server returns a response.

## Security

### Confidentiality, integrity and authentication

Confidentiality keeps data secret. Integrity detects unauthorized changes. Authentication checks an identity or message origin.

Remember: Encryption, integrity checking and identity checking solve different problems.

## Course references

Source map: I2208 Part 1 (network basics); Part 2 (layers, devices and addresses); Part 3 (signals and link capacity); Part 6 (Ethernet switching); Part 7 (IP, subnetting, routing and DHCP). I3304 Part 1 (layer recap, IPv4 and ARP); Parts 2–3 (routing); Part 4 (NAT and IPv6); Part 5 (TCP/UDP); Part 6 (application protocols and DNS); Part 7 (security). Examples are simplified applications of these concepts. This is a selection of common fundamentals, not a claim about which questions any particular interviewer will ask.
